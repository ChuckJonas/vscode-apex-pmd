'use strict';

import * as vscode from 'vscode';
import { ApexPmd } from './lib/apexPmd';
import { Config } from './lib/config';
import * as path from 'path';
import { AppStatus } from './lib/appStatus'

export { ApexPmd };

const supportedLanguageCodes = ['apex', 'visualforce']
const isSupportedLanguage = (langCode: string) => 0 <= supportedLanguageCodes.indexOf(langCode)

export function activate(context: vscode.ExtensionContext) {

    //setup config
    const config = new Config();
    const appName = 'Apex PMD';

    if(!config.rulesetPath){
        config.rulesetPath = context.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
    }else if (!path.isAbsolute(config.rulesetPath) && vscode.workspace.rootPath) {
        //convert relative path to absolute
        config.rulesetPath = path.join(vscode.workspace.rootPath, config.rulesetPath);
    }

    if (!config.pmdBinPath) {
        config.pmdBinPath = context.asAbsolutePath(path.join('bin', 'pmd'));
    }

    //setup instance vars
    const collection = vscode.languages.createDiagnosticCollection('apex-pmd');
    const outputChannel = vscode.window.createOutputChannel(appName);

    const pmd = new ApexPmd(outputChannel, config.pmdBinPath, config.rulesetPath, config.priorityErrorThreshold, config.priorityWarnThreshold, config.showErrors, config.showStdOut, config.showStdErr);
    AppStatus.setAppName(appName);
    AppStatus.getInstance().ok();

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

    context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(editors => {
        const isStatusNeeded = editors.some((e) => e.document && isSupportedLanguage(e.document.languageId))
        if (isStatusNeeded) {
            AppStatus.getInstance().show();
        } else {
            AppStatus.getInstance().hide();
        }
    }));

    vscode.workspace.onDidCloseTextDocument((textDocument) => {
        collection.delete(textDocument.uri);
    });
}

export function deactivate() { }

