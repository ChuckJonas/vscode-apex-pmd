'use strict';

import * as vscode from 'vscode';
import {ApexPmd} from './lib/apexPmd';
import {Config} from './lib/config';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

    //setup config
    let config = new Config();
    if(config.useDefaultRuleset){
        config.rulesetPath = context.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
    }

    //setup instance vars
    const collection = vscode.languages.createDiagnosticCollection('apex-pmd');
    const pmd = new ApexPmd(config.pmdPath, config.rulesetPath, config.priorityErrorThreshold, config.priorityWarnThreshold);

    //setup commands
    context.subscriptions.push(
        vscode.commands.registerCommand('apex-pmd.runWorkspace', () => {
            pmd.run(vscode.workspace.rootPath, collection);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('apex-pmd.runFile', (fileName: string) => {
            if(!fileName){
                fileName = vscode.window.activeTextEditor.document.fileName;
            }
            pmd.run(fileName, collection);
        })
    );

    //setup listeners
    if(config.runOnFileOpen){
        vscode.workspace.onDidSaveTextDocument((textDocument) => {
            if(textDocument.languageId == 'apex'){
                return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName);
            }
        });
    }

    if(config.runOnFileSave){
        vscode.workspace.onDidOpenTextDocument((textDocument) => {
            if(textDocument.languageId == 'apex'){
                return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName);
            }
        });
    }

    vscode.workspace.onDidCloseTextDocument((textDocument) => {
        collection.delete(textDocument.uri);
    });
}

export function deactivate() {}

