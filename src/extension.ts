'use strict';

import * as vscode from 'vscode';
import { ApexPmd } from './lib/apexPmd';
import { Config } from './lib/config';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

    //setup config
    let config = new Config();
    if(config.useDefaultRuleset){
        config.rulesetPath = context.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
    } else {
        if (!path.isAbsolute(config.rulesetPath) && vscode.workspace.rootPath) {
            config.rulesetPath = path.join(vscode.workspace.rootPath, config.rulesetPath);
        }
    }

    if(!config.pmdPath){
        config.pmdPath = context.asAbsolutePath(path.join('out', 'pmd'));
    }

    //setup instance vars
    const collection = vscode.languages.createDiagnosticCollection('apex-pmd');
    const outputChannel = vscode.window.createOutputChannel('Apex PMD');

    //setup commands
    context.subscriptions.push(
         vscode.commands.registerCommand('apex-pmd.showOutput', () => {
            outputChannel.show();
        })
    );

    const pmd = new ApexPmd(outputChannel, config.pmdPath, config.rulesetPath, config.priorityErrorThreshold, config.priorityWarnThreshold, config.showErrors, config.showStdOut, config.showStdErr);

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
    if(config.runOnFileSave){
        vscode.workspace.onDidSaveTextDocument((textDocument) => {
            if(textDocument.languageId == 'apex'){
                return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName);
            }
        });
    }

    if(config.runOnFileOpen){
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

