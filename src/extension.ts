'use strict';

import * as vscode from 'vscode';
import { ApexPmd } from './lib/apexPmd';
import { Config } from './lib/config';
import { AppStatus } from './lib/appStatus';
import { debounce } from 'debounce';
import { getRootWorkspacePath } from './lib/utils';
export { ApexPmd };

const supportedLanguageCodes = ['apex', 'visualforce'];
const isSupportedLanguage = (langCode: string) => 0 <= supportedLanguageCodes.indexOf(langCode);

const appName = 'Apex PMD';
const settingsNamespace = 'apexPMD';
const collection = vscode.languages.createDiagnosticCollection('apex-pmd');
const outputChannel = vscode.window.createOutputChannel(appName);

export function activate(context: vscode.ExtensionContext) {
  //setup config
  const config = new Config(context);

  //setup instance vars
  const pmd = new ApexPmd(outputChannel, config);
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
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Running Static Analysis on workspace',
          cancellable: true,
        },
        (progress, token) => {
          progress.report({ increment: 0 });
          return pmd.run(getRootWorkspacePath(), collection, progress, token);
        }
      );
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
      if (isSupportedLanguage(textDocument.languageId)) {
        return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName);
      }
    });
  }

  if (config.runOnFileChange) {
    vscode.workspace.onDidChangeTextDocument(
      debounce((textDocumentChangeEvent: vscode.TextDocumentChangeEvent) => {
        const textDocument = textDocumentChangeEvent.document;
        if (isSupportedLanguage(textDocument.languageId)) {
          return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName);
        }
      }, config.onFileChangeDebounce)
    );
  }

  if (config.runOnFileOpen) {
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (isSupportedLanguage(editor.document.languageId)) {
        return vscode.commands.executeCommand('apex-pmd.runFile', editor.document.fileName, true);
      }
    });
  }

  vscode.workspace.onDidChangeConfiguration((configChange: vscode.ConfigurationChangeEvent) => {
    if (configChange.affectsConfiguration(settingsNamespace)) {
      config.init();
      return pmd.updateConfiguration(config);
    }
  });

  context.subscriptions.push(
    vscode.window.onDidChangeVisibleTextEditors((editors) => {
      const isStatusNeeded = editors.some((e) => e.document && isSupportedLanguage(e.document.languageId));
      if (isStatusNeeded) {
        AppStatus.getInstance().show();
      } else {
        AppStatus.getInstance().hide();
      }
    })
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
