'use strict';

import * as vscode from 'vscode';
import {ApexPmd} from './lib/apexPmd';


export function activate(context: vscode.ExtensionContext) {

    //setup config
    let config = vscode.workspace.getConfiguration('apexPMD');
    let rulesetPath = context.asAbsolutePath('src/lib/rulesets/apex_ruleset.xml');
    if(!config.get('useDefaultRuleset') as boolean){
        rulesetPath = config.get('rulesetPath') as string;
    }
    let pmdPath = config.get('pmdPath') as string;

    //setup instance vars
    const collection = vscode.languages.createDiagnosticCollection('apex-pmd');
    const pmd = new ApexPmd(pmdPath, rulesetPath);

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
    if(config.get('runOnFileOpen') as boolean){
        vscode.workspace.onDidSaveTextDocument((textDocument) => {
            if(textDocument.languageId == 'apex'){
                return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName);
            }
        });
    }

    if(config.get('runOnFileSave') as boolean){
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

