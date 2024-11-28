//=== Util ===
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

export function getRootWorkspacePath(): string {
  const ws = vscode.workspace;
  const hasWorkspaceRoot = ws && ws.workspaceFolders && ws.workspaceFolders.length > 0;
  return hasWorkspaceRoot ? vscode.workspace.workspaceFolders![0].uri.fsPath : '';
}

export function fileExists(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath);
    return stat.isFile();
  } catch (err) {
    return false;
  }
}

export function dirExists(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath);
    return stat.isDirectory();
  } catch (err) {
    return false;
  }
}

export function stripQuotes(s: string): string {
  return s.substr(1, s.length - 2);
}

export function findSfdxProject(startFile: string, defaultFallback: string): string {
  let currentDir = path.dirname(startFile);
  while (currentDir !== '') {
    let found = fs.readdirSync(currentDir).some(s => 'sfdx-project.json' === s);
    if (found) {
      return currentDir;
    }
    let paths = currentDir.split(path.sep);
    paths.pop(); // remove last
    currentDir = paths.join(path.sep);
  }
  return defaultFallback;
}
