'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import { getRootWorkspacePath } from './utils';

export class Config {
  private _rulesetPath: string;
  public workspaceRootPath: string;
  public rulesets: string[];
  public pmdBinPath: string;
  public priorityErrorThreshold: number;
  public priorityWarnThreshold: number;
  public runOnFileOpen: boolean;
  public runOnFileSave: boolean;
  public runOnFileChange: boolean;
  public onFileChangeDebounce: number;
  public showErrors: boolean;
  public showStdOut: boolean;
  public showStdErr: boolean;
  public enableCache: boolean;
  public additionalClassPaths: string[];
  public commandBufferSize: number;
  public jrePath: string;

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
    const config = vscode.workspace.getConfiguration('apexPMD');
    // deprecated setting is left for backward compatibility
    this._rulesetPath = config.get('rulesetPath');
    this.workspaceRootPath = getRootWorkspacePath();
    this.rulesets = config.get('rulesets');
    this.pmdBinPath = config.get('pmdBinPath');
    this.priorityErrorThreshold = config.get('priorityErrorThreshold');
    this.priorityWarnThreshold = config.get('priorityWarnThreshold');
    this.runOnFileOpen = config.get('runOnFileOpen');
    this.runOnFileSave = config.get('runOnFileSave');
    this.runOnFileChange = config.get('runOnFileChange');
    this.onFileChangeDebounce = config.get('onFileChangeDebounce');
    this.showErrors = config.get('showErrors');
    this.showStdOut = config.get('showStdOut');
    this.showStdErr = config.get('showStdErr');
    this.enableCache = config.get('enableCache');
    this.additionalClassPaths = config.get('additionalClassPaths');
    this.commandBufferSize = config.get('commandBufferSize');
    this.jrePath = config.get('jrePath');
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

    if (this.pmdBinPath && !path.isAbsolute(this.pmdBinPath) && this.workspaceRootPath) {
      this.pmdBinPath = path.join(this.workspaceRootPath, this.pmdBinPath);
    }

    if (this.jrePath && !path.isAbsolute(this.jrePath) && this.workspaceRootPath) {
      this.jrePath = path.join(this.workspaceRootPath, this.jrePath);
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
