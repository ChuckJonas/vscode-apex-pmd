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
import {ApexPmd} from '../src/extension';


const PMD_PATH = path.join(__dirname, '..', '..', 'bin', 'pmd');
const RULESET_PATH = path.join(__dirname, '..', '..', 'rulesets', 'apex_ruleset.xml');
const INVALID_RULESET_PATH = path.join(__dirname, '..', '..', 'rulesets', 'apex_ruleset_invalid.xml');
const TEST_APEX_PATH = path.join(__dirname, '..', '..', 'test', 'assets', 'test.cls');

suite("Extension Tests", () => {

    test("check default paths", () => {
        const outputChannel = vscode.window.createOutputChannel('Apex PMD');
        
        const pmd = new ApexPmd(
            outputChannel, 
            PMD_PATH, 
            [RULESET_PATH, INVALID_RULESET_PATH], 
            3, 
            1, 
            false, 
            false, 
            false
        );

        assert.equal(pmd.checkPmdPath(), true);
        assert.equal(pmd.getRulesets()[0], RULESET_PATH);
        assert.equal(pmd.getRulesets().length, 1);
        assert.equal(pmd.hasAtLeastOneValidRuleset(), true);
    });

    // Defines a Mocha unit test
    test("test diagnostic warning", function(done) {
        this.timeout(10000);
        
        const collection = vscode.languages.createDiagnosticCollection('apex-pmd-test');
        const outputChannel = vscode.window.createOutputChannel('Apex PMD');
        
        const pmd = new ApexPmd(
            outputChannel, 
            PMD_PATH, 
            [RULESET_PATH], 
            3, 
            1, 
            false, 
            false, 
            false
        );

        let testApexUri = vscode.Uri.file(TEST_APEX_PATH);
        pmd.run(TEST_APEX_PATH, collection).then(()=>{
            let errs = collection.get(testApexUri);
            assert.equal(errs.length, 1);
            done();
        }).catch(e => {
            assert.fail(e);
            done();
        });
    });
});