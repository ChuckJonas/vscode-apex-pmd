//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import { ApexPmd } from '../../src/extension';
import { Config } from '../../src/lib/config';
import * as fs from 'fs';

const PMD_PATH = path.join(__dirname, '..', '..', '..', 'bin', 'pmd');
const RULESET_PATH = path.join(__dirname, '..', '..', '..', 'rulesets', 'apex_ruleset.xml');
const INVALID_RULESET_PATH = path.join(__dirname, '..', '..', '..', 'rulesets', 'apex_ruleset_invalid.xml');
const TEST_ASSETS_PATH = path.join(__dirname, '..', '..', '..', 'test', 'assets');
const TEST_APEX_PATH = path.join(TEST_ASSETS_PATH, 'test.cls');

const outputChannel = vscode.window.createOutputChannel('Apex PMD');

suite('Extension Tests', () => {
  test('check default paths', () => {
    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [RULESET_PATH, INVALID_RULESET_PATH];
    config.priorityErrorThreshold = 3;
    config.priorityWarnThreshold = 1;
    config.additionalClassPaths = [];

    const pmd = new ApexPmd(outputChannel, config);

    assert.equal(pmd.checkPmdPath(), true);
    assert.equal(pmd.getRulesets()[0], RULESET_PATH);
    assert.equal(pmd.getRulesets().length, 1);
    assert.equal(pmd.hasAtLeastOneValidRuleset(), true);
  });

  test('test diagnostic warning', function (done) {
    this.timeout(100000);

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [RULESET_PATH];
    config.priorityErrorThreshold = 3;
    config.priorityWarnThreshold = 1;
    config.workspaceRootPath = '';
    config.additionalClassPaths = [];
    config.commandBufferSize = 64000000;

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(TEST_APEX_PATH);
    pmd
      .run(TEST_APEX_PATH, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        assert.equal(errs.length, 1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('test additionalClassPaths with custom rule', function (done) {
    this.timeout(100000);

    const workspaceRootPath = path.join(TEST_ASSETS_PATH, 'project1');
    const rulesetPath = path.join(workspaceRootPath, 'apex_ruleset.xml');
    const additionalClassPaths = path.join(workspaceRootPath, 'custom_rule', 'custom-apex-pmd-rules.jar');
    const apexClassFile = path.join(workspaceRootPath, 'test.cls');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [rulesetPath];
    config.priorityErrorThreshold = 3;
    config.priorityWarnThreshold = 1;
    config.workspaceRootPath = workspaceRootPath;
    config.additionalClassPaths = [additionalClassPaths];
    config.commandBufferSize = 64000000;

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(apexClassFile);
    pmd
      .run(apexClassFile, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        assert.strictEqual(errs.length, 1);
        assert.strictEqual(errs[0].message, 'Violation... (rule: Test ruleset-MyCustomRule)');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('test workspace root path with spaces', function (done) {
    this.timeout(100000);

    const workspaceRootPath = path.join(TEST_ASSETS_PATH, 'project2 - with space');
    const apexClassFile = path.join(workspaceRootPath, 'test.cls');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [RULESET_PATH];
    config.priorityErrorThreshold = 3;
    config.priorityWarnThreshold = 1;
    config.workspaceRootPath = workspaceRootPath;
    config.additionalClassPaths = [];
    config.commandBufferSize = 64000000;

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(apexClassFile);
    pmd
      .run(apexClassFile, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        assert.strictEqual(errs.length, 1);

        const diagnostic = errs[0];
        const code = diagnostic.code as { value: string };
        assert.strictEqual(code.value, 'OperationWithLimitsInLoop');
        assert.strictEqual(diagnostic.range.start.line, 6); // vscode lines are 0-based
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('test workspace root path with spaces and pmdBinPath with spaces', function (done) {
    this.timeout(100000);

    const workspaceRootPath = path.join(TEST_ASSETS_PATH, 'project2 - with space');
    const pmdBinPath = path.join(workspaceRootPath, 'pmd-copy');
    const pmdBinSource = path.join(workspaceRootPath, '../../../bin/pmd');

    // cannot create a symlink from pmdBinSource -> pmdBinPath, as
    // symlinks are not really supported by win32/git. Under Windows, the user needs extra permissions.
    // That's why after git clone/checkout, the symlink is not properly restored (core.symlinks is by default false).
    // We simply copy the whole directory into workspace...
    const copyDirectory = function (source: string, destination: string) {
      for (const file of fs.readdirSync(source)) {
        const originalFilePath = path.join(source, file);
        const targetFilePath = path.join(destination, file);
        const stat = fs.statSync(originalFilePath);
        if (stat.isFile()) {
          fs.copyFileSync(originalFilePath, targetFilePath);
        } else if (stat.isDirectory()) {
          fs.mkdirSync(targetFilePath);
          copyDirectory(originalFilePath, targetFilePath);
        }
      }
    };
    const deleteDirectory = function (dir: string) {
      for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          fs.unlinkSync(filePath);
        } else if (stat.isDirectory()) {
          deleteDirectory(filePath);
        }
      }
      fs.rmdirSync(dir);
    };
    if (fs.existsSync(pmdBinPath)) {
      deleteDirectory(pmdBinPath);
    }
    fs.mkdirSync(pmdBinPath);
    copyDirectory(pmdBinSource, pmdBinPath);

    const apexClassFile = path.join(workspaceRootPath, 'test.cls');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = pmdBinPath;
    config.rulesets = [RULESET_PATH];
    config.priorityErrorThreshold = 3;
    config.priorityWarnThreshold = 1;
    config.workspaceRootPath = workspaceRootPath;
    config.additionalClassPaths = [];
    config.commandBufferSize = 64000000;

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(apexClassFile);
    pmd
      .run(apexClassFile, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        assert.strictEqual(errs.length, 1);

        const diagnostic = errs[0];
        const code = diagnostic.code as { value: string };
        assert.strictEqual(code.value, 'OperationWithLimitsInLoop');
        assert.strictEqual(diagnostic.range.start.line, 6); // vscode lines are 0-based
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
