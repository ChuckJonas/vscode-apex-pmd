import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { ApexPmd } from '../../src/extension';
import { Config } from '../../src/lib/config';
import * as fs from 'fs';
import { TestUtils } from './test-utils';

const PMD_PATH = path.join(__dirname, '..', '..', '..', 'bin', 'pmd');
const RULESET_PATH = path.join(__dirname, '..', '..', '..', 'rulesets', 'apex_ruleset.xml');
const TEST_ASSETS_PATH = path.join(__dirname, '..', '..', '..', 'test', 'assets');
const TEST_ASSETS_TEMP_PATH = path.join(__dirname, '..', '..', '..', 'test', 'assets_temp');
const TEST_APEX_PATH = path.join(TEST_ASSETS_PATH, 'test.cls');

const outputChannel = vscode.window.createOutputChannel('Apex PMD');

suite('PMD Execution related tests', () => {
  test('test default (exec)', function (done) {
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
        assert.strictEqual(errs.length, 1, "Wrong number of found violations");
        assert.strictEqual(errs[0].message, "Avoid operations in loops that may hit governor limits (rule: Performance-OperationWithLimitsInLoop)");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('test default (execFile)', function (done) {
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
    config.childProcessMethod = 'execFile';

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(TEST_APEX_PATH);
    pmd
      .run(TEST_APEX_PATH, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        assert.strictEqual(errs.length, 1, "Wrong number of found violations");
        assert.strictEqual(errs[0].message, "Avoid operations in loops that may hit governor limits (rule: Performance-OperationWithLimitsInLoop)");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  test('test default (spawn)', function (done) {
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
    config.childProcessMethod = 'spawn';

    const pmd = new ApexPmd(outputChannel, config);

    const testApexUri = vscode.Uri.file(TEST_APEX_PATH);
    pmd
      .run(TEST_APEX_PATH, collection)
      .then(() => {
        const errs = collection.get(testApexUri);
        assert.strictEqual(errs.length, 1, "Wrong number of found violations");
        assert.strictEqual(errs[0].message, "Avoid operations in loops that may hit governor limits (rule: Performance-OperationWithLimitsInLoop)");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
