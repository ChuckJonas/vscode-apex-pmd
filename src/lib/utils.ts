//=== Util ===
import * as fs from 'fs';
import * as vscode from 'vscode';

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
  return s.substring(1, s.length - 2);
}
