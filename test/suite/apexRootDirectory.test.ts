import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { ApexPmd } from '../../src/extension';
import { Config } from '../../src/lib/config';
import * as fs from 'fs';
import { TestUtils } from './test-utils';

const PMD_PATH = path.join(__dirname, '..', '..', '..', 'bin', 'pmd');
const TEST_ASSETS_PATH = path.join(__dirname, '..', '..', '..', 'test', 'assets');
const TEST_ASSETS_TEMP_PATH = path.join(__dirname, '..', '..', '..', 'test', 'assets_temp');

const outputChannel = vscode.window.createOutputChannel('Apex PMD');

suite('Apex Root Directory related tests', () => {
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
