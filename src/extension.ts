'use strict';

import * as vscode from 'vscode';
import { ApexPmd } from './lib/apexPmd';
import { Config } from './lib/config';
import * as path from 'path';

export { ApexPmd };

const supportedLanguageCodes = ['apex', 'visualforce']
const isSupportedLanguage = (langCode: string) => 0 <= supportedLanguageCodes.indexOf(langCode)

export function activate(context: vscode.ExtensionContext) {

    //setup config
    let config = new Config();

    if(!config.rulesetPath){
        config.rulesetPath = context.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
    }else if (!path.isAbsolute(config.rulesetPath) && vscode.workspace.rootPath) {
        //convert relative path to absolute
        config.rulesetPath = path.join(vscode.workspace.rootPath, config.rulesetPath);
    }

    if (!config.pmdPath) {
        config.pmdPath = context.asAbsolutePath(path.join('out', 'pmd'));
    }

    //setup instance vars
    const collection = vscode.languages.createDiagnosticCollection('apex-pmd');
    const outputChannel = vscode.window.createOutputChannel('Apex PMD');

    const pmd = new ApexPmd(outputChannel, config.pmdPath, config.rulesetPath, config.priorityErrorThreshold, config.priorityWarnThreshold, config.showErrors, config.showStdOut, config.showStdErr);

    context.subscriptions.push(
        vscode.commands.registerCommand('apex-pmd.clearProblems', () => {
            collection.clear();
        })
    );

    //setup commands
    context.subscriptions.push(
        vscode.commands.registerCommand('apex-pmd.runWorkspace', () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Running Static Analysis on workspace",
                cancellable: true
            }, (progress, token) => {
                progress.report({ increment: 0 });
                return pmd.run(vscode.workspace.rootPath, collection, progress, token);
            });
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('apex-pmd.runFile', (fileName: string) => {
            if (!fileName) {
                fileName = vscode.window.activeTextEditor.document.fileName;
            }
            pmd.run(fileName, collection);
        })
    );

    //setup listeners
    if (config.runOnFileSave) {
        vscode.workspace.onDidSaveTextDocument((textDocument) => {
            if(isSupportedLanguage(textDocument.languageId)){
              return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName);
            }
        });
    }

    if (config.runOnFileOpen) {
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if(isSupportedLanguage(editor.document.languageId)){
                return vscode.commands.executeCommand('apex-pmd.runFile', editor.document.fileName);
            }
        });
    }

    vscode.workspace.onDidCloseTextDocument((textDocument) => {
        collection.delete(textDocument.uri);
    });
}

export function deactivate() { }

