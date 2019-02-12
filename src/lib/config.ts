'use strict';
import * as vscode from 'vscode';
import * as path from 'path';

export class Config{
    private _rulesetPath: string;
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

    public constructor(ctx?: vscode.ExtensionContext){
        if (ctx) {
            let config = vscode.workspace.getConfiguration('apexPMD');
            // deprecated setting is left for backward compatibility
            this._rulesetPath = config.get('rulesetPath') as string;
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
            this.fixPaths(ctx);
        } else {
            console.warn('VSCode ApexPMD missing configuration')
        }
    }

    private fixPaths(context: vscode.ExtensionContext) {
        if (!this.rulesets) {
            this.rulesets = [];
        }

        if (this.rulesets.length) {
            this.rulesets = this.rulesets.map((p) => {
                let res = p;
                if ('default' === res.toLowerCase()) {
                    res = context.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
                } else if (!path.isAbsolute(res) && vscode.workspace.rootPath) {
                    res = path.join(vscode.workspace.rootPath, res);
                }
                return res;
            });
        }

        if(!this._rulesetPath && !this.rulesets.length) {
            this._rulesetPath = context.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
        } else if (this._rulesetPath && !path.isAbsolute(this._rulesetPath) && vscode.workspace.rootPath) {
            //convert relative path to absolute
            this._rulesetPath = path.join(vscode.workspace.rootPath, this._rulesetPath);
        }

        if (this._rulesetPath) {
            this.rulesets.push(this._rulesetPath);
        }

        if (!this.pmdBinPath) {
            this.pmdBinPath = context.asAbsolutePath(path.join('bin', 'pmd'));
        }
    }
}