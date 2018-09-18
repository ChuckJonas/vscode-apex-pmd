'use strict';
import * as vscode from 'vscode';

export class Config{
    public useDefaultRuleset: boolean;
    public rulesetPath: string;
    public pmdBinPath: string;
    public priorityErrorThreshold: number;
    public priorityWarnThreshold: number;
    public runOnFileOpen: boolean;
    public runOnFileSave: boolean;
    public showErrors : boolean;
    public showStdOut : boolean;
    public showStdErr : boolean;

    public constructor(){
        let config = vscode.workspace.getConfiguration('apexPMD');
        this.useDefaultRuleset = config.get('useDefaultRuleset') as boolean;
        this.rulesetPath = config.get('rulesetPath') as string;
        this.pmdBinPath = config.get('pmdBinPath') as string;
        this.priorityErrorThreshold = config.get('priorityErrorThreshold') as number;
        this.priorityWarnThreshold = config.get('priorityWarnThreshold') as number;
        this.runOnFileOpen = config.get('runOnFileOpen') as boolean;
        this.runOnFileSave = config.get('runOnFileSave') as boolean;
        this.showErrors = config.get('showErrors') as boolean;
        this.showStdOut = config.get('showStdOut') as boolean;
        this.showStdErr = config.get('showStdErr') as boolean;
    }
}