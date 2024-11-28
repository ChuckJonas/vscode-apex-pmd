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
import { TestUtils } from './test-utils';

const PMD_PATH = path.join(__dirname, '..', '..', '..', 'bin', 'pmd');
const RULESET_PATH = path.join(__dirname, '..', '..', '..', 'rulesets', 'apex_ruleset.xml');
const INVALID_RULESET_PATH = path.join(__dirname, '..', '..', '..', 'rulesets', 'apex_ruleset_invalid.xml');
const TEST_ASSETS_PATH = path.join(__dirname, '..', '..', '..', 'test', 'assets');
const TEST_ASSETS_TEMP_PATH = path.join(__dirname, '..', '..', '..', 'test', 'assets_temp');
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
        assert.strictEqual(errs[0].message, "Violation... (rule: Test ruleset-MyCustomRule)");
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
        const code = diagnostic.code as {value :string };
        assert.strictEqual(code.value, "OperationWithLimitsInLoop");
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
    TestUtils.deleteDirectory(pmdBinPath);
    TestUtils.copyDirectory(pmdBinSource, pmdBinPath);

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
        const code = diagnostic.code as {value :string };
        assert.strictEqual(code.value, "OperationWithLimitsInLoop");
        assert.strictEqual(diagnostic.range.start.line, 6); // vscode lines are 0-based
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('UnusedMethod with Apex Link and PMD_APEX_ROOT_DIRECTORY as workspace root (default automatic)', function (done) {
    this.timeout(100000);

    const workspaceRootPath = path.join(TEST_ASSETS_PATH, 'project3_unusedmethod');
    const rulesetPath = path.join(workspaceRootPath, 'custom_ruleset.xml');
    const apexClassFile = path.join(workspaceRootPath, 'src', 'Foo.cls');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [rulesetPath];
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
        assert.strictEqual(errs.length, 1, "Wrong number of found violations");
        assert.strictEqual(errs[0].message, "Unused methods make understanding code harder (rule: Design-UnusedMethod)");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('UnusedMethod with Apex Link and PMD_APEX_ROOT_DIRECTORY as workspace root (off)', function (done) {
    this.timeout(100000);

    const workspaceRootPath = path.join(TEST_ASSETS_PATH, 'project3_unusedmethod');
    const rulesetPath = path.join(workspaceRootPath, 'custom_ruleset.xml');
    const apexClassFile = path.join(workspaceRootPath, 'src', 'Foo.cls');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [rulesetPath];
    config.priorityErrorThreshold = 3;
    config.priorityWarnThreshold = 1;
    config.workspaceRootPath = workspaceRootPath;
    config.additionalClassPaths = [];
    config.commandBufferSize = 64000000;
    config.apexRootDirectory = { "mode": "off" };

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(apexClassFile);
    pmd
      .run(apexClassFile, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        // we don't detect the violation, as ApexLink is not setup correctly (sfdx-project.json is not used)
        assert.strictEqual(errs.length, 0, "Wrong number of found violations");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('UnusedMethod with Apex Link and PMD_APEX_ROOT_DIRECTORY as subdirectory (default automatic)', function (done) {
    this.timeout(100000);

    // copy the original sample project and create a subfolder structure
    const workspaceRootPath = path.join(TEST_ASSETS_TEMP_PATH, 'project3_unusedmethod_subdir');
    const sourcePath = path.join(TEST_ASSETS_PATH, 'project3_unusedmethod');
    TestUtils.deleteDirectory(workspaceRootPath)
    fs.mkdirSync(workspaceRootPath, { recursive: true });
    TestUtils.copyDirectory(sourcePath, path.join(workspaceRootPath, 'module'));


    const rulesetPath = path.join(workspaceRootPath, 'module', 'custom_ruleset.xml');
    const apexClassFile = path.join(workspaceRootPath, 'module', 'src', 'Foo.cls');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [rulesetPath];
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
        assert.strictEqual(errs.length, 1, "Wrong number of found violations");
        assert.strictEqual(errs[0].message, "Unused methods make understanding code harder (rule: Design-UnusedMethod)");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('UnusedMethod with Apex Link and PMD_APEX_ROOT_DIRECTORY with weird folder structure (custom)', function (done) {
    this.timeout(100000);

    // copy the original sample project and create a subfolder structure
    const workspaceRootPath = path.join(TEST_ASSETS_TEMP_PATH, 'project3_unusedmethod_weird');
    const sourcePath = path.join(TEST_ASSETS_PATH, 'project3_unusedmethod');
    TestUtils.deleteDirectory(workspaceRootPath)
    fs.mkdirSync(path.join(workspaceRootPath, 'subdir'), { recursive: true });
    TestUtils.copyDirectory(sourcePath, path.join(workspaceRootPath, 'subdir', 'module'));
    // replace the original sfdx-project.json file in subdir/module with a broken one
    fs.unlinkSync(path.join(workspaceRootPath, 'subdir', 'module', 'sfdx-project.json'));
    // it's broken because of referencing paths _not within_ the project
    fs.writeFileSync(path.join(workspaceRootPath, 'subdir', 'module', 'sfdx-project.json'), `
        {
          "packageDirectories": [
            {
              "path": "../some-other-directory/src",
              "default": true
            }
          ],
          "namespace": "foo_ns"
        }
        `);
    // and create a new one in the parent directory (subdir) - but not in workspaceRoot (that would be a default fallback).
    fs.writeFileSync(path.join(workspaceRootPath, 'subdir', 'sfdx-project.json'), `
      {
        "packageDirectories": [
          {
            "path": "module/src",
            "default": true
          }
        ],
        "namespace": "foo_ns"
      }
      `);

    const rulesetPath = path.join(workspaceRootPath, 'subdir', 'module', 'custom_ruleset.xml');
    const apexClassFile = path.join(workspaceRootPath, 'subdir', 'module', 'src', 'Foo.cls');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');

    const config = new Config();
    config.pmdBinPath = PMD_PATH;
    config.rulesets = [rulesetPath];
    config.priorityErrorThreshold = 3;
    config.priorityWarnThreshold = 1;
    config.workspaceRootPath = workspaceRootPath;
    config.additionalClassPaths = [];
    config.commandBufferSize = 64000000;
    config.apexRootDirectory = { "mode": "custom", "custom": path.join(workspaceRootPath, 'subdir') };

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(apexClassFile);
    pmd
      .run(apexClassFile, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        assert.strictEqual(errs.length, 1, "Wrong number of found violations");
        assert.strictEqual(errs[0].message, "Unused methods make understanding code harder (rule: Design-UnusedMethod)");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
