'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ApexPmd} from './lib/apexPmd';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const pmdPath = context.asAbsolutePath('/out/bin/pmd/bin/run.sh');

    const collection = vscode.languages.createDiagnosticCollection('apex-pmd');

    const pmd = new ApexPmd(pmdPath);

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.apex-pmd.runWorkspace', () => {
            let path = vscode.workspace.rootPath;
            pmd.run(path, collection);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.apex-pmd.runFile', () => {
            let path = vscode.window.activeTextEditor.document.fileName;
            pmd.run(path, collection);
        })
    );

}

// this method is called when your extension is deactivated
export function deactivate() {}

//===Helpers===

