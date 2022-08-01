'use strict';

import * as vscode from 'vscode';
import { ApexPmd } from './lib/apexPmd';
import { Config } from './lib/config';
import { AppStatus } from './lib/appStatus';
import { debounce } from 'debounce';
import { getRootWorkspacePath } from './lib/utils';
import { Diagnostic } from 'vscode';
export { ApexPmd };

const supportedLanguageCodes = ['apex', 'visualforce', 'xml'];
const isSupportedLanguage = (langCode: string) => 0 <= supportedLanguageCodes.indexOf(langCode);

const appName = 'Apex PMD';
const settingsNamespace = 'apexPMD';
const collection = vscode.languages.createDiagnosticCollection('apex-pmd');
const outputChannel = vscode.window.createOutputChannel(appName);

export function activate(context: vscode.ExtensionContext) {
  //setup config
  const config = new Config(context);

  // Is filtering on tab close enabled, disabled when showing all workspace issues
  let filterOnTabClose = true;

  //setup instance vars
  const pmd = new ApexPmd(outputChannel, config);
  AppStatus.setAppName(appName);
  AppStatus.getInstance().ok();

  context.subscriptions.push(
    vscode.commands.registerCommand('apex-pmd.clearProblems', () => {
      filterOnTabClose = true;
      collection.clear();
    })
  );

  //setup commands
  context.subscriptions.push(
    vscode.commands.registerCommand('apex-pmd.runWorkspace', () => {
      filterOnTabClose = false;
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
    vscode.commands.registerCommand('apex-pmd.runFileMenu', (uri: vscode.Uri) => {
      pmd.run(uri.fsPath, collection);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('apex-pmd.runFile', (fileName: string, filterDiagnostics: boolean) => {
      if (!fileName) {
        fileName = vscode.window.activeTextEditor.document.fileName;
      }
      pmd.run(fileName, collection).then(() => {
        // Filter results for just this file in case tab is closed before we got results
        if (filterOnTabClose && filterDiagnostics)
          filterDiagnosticsByOpenTabs(config, new Set([fileName]))
      })
    })
  );

  //setup listeners
  if (config.runOnFileSave) {
    vscode.workspace.onDidSaveTextDocument((textDocument) => {
      if (isSupportedLanguage(textDocument.languageId)) {
        return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName, false);
      }
    });
  }

  if (config.runOnFileChange) {
    vscode.workspace.onDidChangeTextDocument(
      debounce((textDocumentChangeEvent: vscode.TextDocumentChangeEvent) => {
        const textDocument = textDocumentChangeEvent.document;
        if (isSupportedLanguage(textDocument.languageId)) {
          return vscode.commands.executeCommand('apex-pmd.runFile', textDocument.fileName, false);
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

  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabs(() => {
      if (filterOnTabClose)
        filterDiagnosticsByOpenTabs(config);
    })
  )
}

function filterDiagnosticsByOpenTabs(config: Config, onlyFiles: Set<string> = new Set()): void {

  // Collect text doc uri open in any tab
  const openDocuments = new Set()
  vscode.window.tabGroups.all.forEach(tabGroup => {
    tabGroup.tabs.forEach(tab => {
      if (tab.input instanceof vscode.TabInputText) {
        openDocuments.add(tab.input.uri.fsPath)
      }
    })
  })

  // Filter diagnostics in docs that are *not* open in a tab
  // Set onlyFile to restrict documents impacted
  collection.forEach((uri, diagnostics) => {
    if (!openDocuments.has(uri.fsPath)) {
      if (onlyFiles.size == 0 || onlyFiles.has(uri.fsPath)) {
        collection.set(uri, diagnostics.filter(diagnostic => {
          const priorityMaybe = diagnosticPriority(diagnostic)
          return priorityMaybe == null ||
            priorityMaybe <= config.priorityClearOnClose
        }))
      }
    }
  })

}

function diagnosticPriority(diagnostic: Diagnostic): number | null {
  const matched = diagnostic.message.match(/priority: [0-9+]/)
  if (matched)
    return parseInt(matched[0].substring(10))
  else
    null
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }
