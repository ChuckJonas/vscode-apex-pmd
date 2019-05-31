'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

export class Config {
    private _rulesetPath: string;
    public workspaceRootPath: string;
    public rulesets: string[];
    public pmdBinPath: string;
    public priorityErrorThreshold: number;
    public priorityWarnThreshold: number;
    public runOnFileOpen: boolean;
    public runOnFileSave: boolean;
    public showErrors: boolean;
    public showStdOut: boolean;
    public showStdErr: boolean;
    public enableCache: boolean;
    public additionalClassPaths: string[];
    public commandBufferSize: number;

    private _ctx: vscode.ExtensionContext;

    public constructor(ctx?: vscode.ExtensionContext) {
        if (ctx) {
            this._ctx = ctx;
            this.init();
        } else {
            console.warn('VSCode ApexPMD missing configuration');
        }
    }

    public init() {
    let config = vscode.workspace.getConfiguration('apexPMD');
        // deprecated setting is left for backward compatibility
        this._rulesetPath = config.get('rulesetPath') as string;
        this.workspaceRootPath = getRootWorkspacePath();
        this.rulesets = config.get("rulesets") as string[];
        this.pmdBinPath = config.get('pmdBinPath') as string;
        this.priorityErrorThreshold = config.get('priorityErrorThreshold') as number;
        this.priorityWarnThreshold = config.get('priorityWarnThreshold') as number;
        this.runOnFileOpen = config.get('runOnFileOpen') as boolean;
        this.runOnFileSave = config.get('runOnFileSave') as boolean;
        this.showErrors = config.get('showErrors') as boolean;
        this.showStdOut = config.get('showStdOut') as boolean;
        this.showStdErr = config.get('showStdErr') as boolean;
        this.enableCache = config.get('enableCache') as boolean;
        this.additionalClassPaths = config.get('additionalClassPaths') as string[];
        this.commandBufferSize = config.get('commandBufferSize') as number;
        this.resolvePaths();
    }

    private resolvePaths() {
        if (!this.rulesets) {
            this.rulesets = [];
        }

        if (this.rulesets.length) {
            this.rulesets = this.rulesets.map((p) => {
                let res = p;
                if ('default' === res.toLowerCase()) {
                    res = this._ctx.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
                } else if (!path.isAbsolute(res) && this.workspaceRootPath) {
                    res = path.join(this.workspaceRootPath, res);
                }
                return res;
            });
        }

        if (!this._rulesetPath && !this.rulesets.length) {
            this._rulesetPath = this._ctx.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
        } else if (this._rulesetPath && !path.isAbsolute(this._rulesetPath) && this.workspaceRootPath) {
            //convert relative path to absolute
            this._rulesetPath = path.join(this.workspaceRootPath, this._rulesetPath);
        }

        if (this._rulesetPath) {
            this.rulesets.push(this._rulesetPath);
        }

        if (!this.pmdBinPath) {
            this.pmdBinPath = this._ctx.asAbsolutePath(path.join('bin', 'pmd'));
        }

        if (!this.additionalClassPaths) {
            this.additionalClassPaths = [];
        }

        if (this.additionalClassPaths.length) {
            this.additionalClassPaths = this.additionalClassPaths.map((unresolvedPath) => {
                let resolvedPath = unresolvedPath;
                if (!path.isAbsolute(unresolvedPath) && this.workspaceRootPath) {
                    resolvedPath = path.join(this.workspaceRootPath, unresolvedPath);
                }
                return resolvedPath;
            });
        }
    }
}

export function getRootWorkspacePath(): string {
    let ws = vscode.workspace;
    let hasWorkspaceRoot = ws && ws.workspaceFolders && ws.workspaceFolders.length > 0;
    return hasWorkspaceRoot
        ? vscode.workspace.workspaceFolders![0].uri.fsPath
        : '';
}