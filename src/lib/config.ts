'use strict';
import * as vscode from 'vscode';

export class Config{
    public useDefaultRuleset: boolean;
    public rulesetPath: string;
    public pmdPath: string;
    public priorityErrorThreshold: number;
    public priorityWarnThreshold: number;
    public runOnFileOpen: boolean;
    public runOnFileSave: boolean;

    public constructor(){
        let config = vscode.workspace.getConfiguration('apexPMD');
        this.useDefaultRuleset = config.get('useDefaultRuleset') as boolean;
        this.rulesetPath = config.get('rulesetPath') as string;
        this.pmdPath = config.get('pmdPath') as string;
        this.priorityErrorThreshold = config.get('priorityErrorThreshold') as number;
        this.priorityWarnThreshold = config.get('priorityWarnThreshold') as number;
        this.runOnFileOpen = config.get('runOnFileOpen') as boolean;
        this.runOnFileSave = config.get('runOnFileSave') as boolean;
    }
}