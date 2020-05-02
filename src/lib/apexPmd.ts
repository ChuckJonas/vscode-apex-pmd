import * as vscode from 'vscode';
import * as ChildProcess from 'child_process';
import * as path from 'path';
import { Config } from './config';
import { AppStatus } from './appStatus';
import * as os from 'os';
import { fileExists, dirExists } from './utils';
import { parsePmdCsv } from './pmdCsvParser';

//setup OS constants
const CLASSPATH_DELM = os.platform() === 'win32' ? ';' : ':';

export class ApexPmd {
  private _pmdPath: string;
  private _rulesets: string[];
  private _errorThreshold: number;
  private _warningThreshold: number;
  private _outputChannel: vscode.OutputChannel;
  private _showErrors: boolean;
  private _showStdOut: boolean;
  private _showStdErr: boolean;
  private _enableCache: boolean;
  private _additionalClassPaths: string[];
  private _workspaceRootPath: string;
  private _commandBufferSize: number;

  public constructor(outputChannel: vscode.OutputChannel, config: Config) {
    this._rulesets = this.getValidRulesetPaths(config.rulesets);
    this._workspaceRootPath = config.workspaceRootPath;
    this._pmdPath = config.pmdBinPath;
    this._errorThreshold = config.priorityErrorThreshold;
    this._warningThreshold = config.priorityWarnThreshold;
    this._outputChannel = outputChannel;
    this._showErrors = config.showErrors;
    this._showStdOut = config.showStdOut;
    this._showStdErr = config.showStdErr;
    this._enableCache = config.enableCache;
    this._additionalClassPaths = config.additionalClassPaths;
    this._commandBufferSize = config.commandBufferSize;
  }

  public updateConfiguration(config: Config) {
    this._rulesets = this.getValidRulesetPaths(config.rulesets);
    this._workspaceRootPath = config.workspaceRootPath;
    this._pmdPath = config.pmdBinPath;
    this._errorThreshold = config.priorityErrorThreshold;
    this._warningThreshold = config.priorityWarnThreshold;
    this._showErrors = config.showErrors;
    this._showStdOut = config.showStdOut;
    this._showStdErr = config.showStdErr;
    this._enableCache = config.enableCache;
    this._additionalClassPaths = config.additionalClassPaths;
  }

  public async run(targetPath: string, collection: vscode.DiagnosticCollection, progress?: vscode.Progress<{ message?: string; increment?: number; }>, token?: vscode.CancellationToken): Promise<void> {
    this._outputChannel.appendLine(`Analyzing ${targetPath}`);
    AppStatus.getInstance().thinking();

    let canceled = false;
    token && token.onCancellationRequested(() => {
      canceled = true;
    });

    if (!this.checkPmdPath() || !this.hasAtLeastOneValidRuleset()) return;

    try {
      let data = await this.executeCmd(targetPath, token);
      let problemsMap = this.parseProblems(data);

      if (problemsMap.size > 0) {
        AppStatus.getInstance().errors();
        progress && progress.report({ message: `Processing ${problemsMap.size} file(s)` });

        let increment = 1 / problemsMap.size * 100;

        for (var [path, issues] of problemsMap) {
          if (canceled) {
            return;
          }

          progress && progress.report({ increment });

          try {
            let uri = vscode.Uri.file(path);
            let doc = await vscode.workspace.openTextDocument(uri);
            //fix ranges to not include whitespace
            issues.forEach(issue => {
              let line = doc.lineAt(issue.range.start.line);
              issue.range = new vscode.Range(
                new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex),
                line.range.end
              );
            });

            collection.set(uri, issues);
          } catch (e) {
            this._outputChannel.appendLine(e);
          }
        }
      } else {
        let uri = vscode.Uri.file(targetPath);
        collection.delete(uri);
        AppStatus.getInstance().ok();
      }
    } catch (e) {
      AppStatus.getInstance().errors();
      vscode.window.showErrorMessage(`Static Analysis Failed. Error Details: ${e}`);
      // should this throw e for promise catch?
    }

  }

  getRulesets() {
    return this._rulesets;
  }

  private getValidRulesetPaths(rulesets: string[]) {
    const validRulesets = rulesets.filter((p) => this.checkRulesetPath(p));
    return validRulesets;
  }

  hasAtLeastOneValidRuleset() {
    if (this._rulesets.length) {
      return true;
    }
    vscode.window.showErrorMessage(`No valid Ruleset paths found in "apexPMD.rulesets". Ensure configuration correct or change back to the default.`);
    return false;
  }

  async executeCmd(targetPath: string, token?: vscode.CancellationToken): Promise<string> {
    // -R Comma-separated list of ruleset or rule references.
    const cachePath = `${this._workspaceRootPath}/.pmdCache`;
    const rulesetsArg = this._rulesets.join(',');

    const cacheKey = this._enableCache ? `-cache "${cachePath}"` : '-no-cache';
    const formatKey = `-f csv`;
    const targetPathKey = `-d "${targetPath}"`;
    const rulesetsKey = `-R "${rulesetsArg}"`;

    const pmdKeys = `${formatKey} ${cacheKey} ${targetPathKey} ${rulesetsKey}`;

    const classPath = [
      path.join(this._pmdPath, 'lib', '*'),
      path.join(this._workspaceRootPath, '*'),
      ...this._additionalClassPaths
    ].join(CLASSPATH_DELM);

    const cmd = `java -cp "${classPath}" net.sourceforge.pmd.PMD ${pmdKeys}`;

    if (this._showStdOut) this._outputChannel.appendLine('PMD Command: ' + cmd);

    let pmdCmd = ChildProcess.exec(cmd,
      { maxBuffer: Math.max(this._commandBufferSize, 1) * 1024 * 1024 });

    token && token.onCancellationRequested(() => {
      pmdCmd.kill();
    });

    let stdout = '';
    let pmdPromise = new Promise<string>(
      (resolve, reject) => {
        pmdCmd.addListener("error", (e) => {
          if (this._showErrors) this._outputChannel.appendLine('error:' + e);
          reject(e);
        });
        pmdCmd.addListener("exit", (e) => {
          if (e !== 0 && e !== 4) {
            this._outputChannel.appendLine(`Failed Exit Code: ${e}`);
            if (!stdout) {
              reject('PMD Command Failed!  Enable "Show StdErr" setting for more info.');
            }
          }
          resolve(stdout);
        });
        pmdCmd.stdout.on('data', (m: string) => {
          if (this._showStdOut) this._outputChannel.appendLine('stdout:' + m);
          stdout += m;
        });
        pmdCmd.stderr.on('data', (m: string) => {
          if (this._showStdErr) this._outputChannel.appendLine('stderr:' + m);
        });
      }
    );
    return pmdPromise;
  }

  parseProblems(csv: string): Map<string, Array<vscode.Diagnostic>> {
    let results = parsePmdCsv(csv);

    let problemsMap = new Map<string, Array<vscode.Diagnostic>>();
    let problemCount = 0;

    for (let i = 1; i < results.length; i++) {
      try {

        let result = results[i];
        if (!results[i]) continue;

        //skip .sfdx files
        if (result.file.includes('.sfdx')) {
          continue;
        }

        let problem = this.createDiagnostic(result);
        if (!problem) continue;

        problemCount++;
        if (problemsMap.has(result.file)) {
          problemsMap.get(result.file).push(problem);
        } else {
          problemsMap.set(result.file, [problem]);
        }
      } catch (ex) {
        this._outputChannel.appendLine(ex);
      }
    }
    this._outputChannel.appendLine(`${problemCount} issue(s) found`);
    return problemsMap;
  }

  createDiagnostic(result: PmdResult): vscode.Diagnostic {
    let lineNum = parseInt(result.line) - 1;

    let uri = `https://pmd.github.io/latest/pmd_rules_apex_${result.ruleSet.split(' ').join('').toLowerCase()}.html#${result.rule.toLowerCase()}`;
    let msg = `${result.description} (rule: ${result.ruleSet}-${result.rule})`;

    let priority = parseInt(result.priority);
    if (isNaN(lineNum)) { return null; }

    let level: vscode.DiagnosticSeverity;
    if (priority <= this._errorThreshold) {
      level = vscode.DiagnosticSeverity.Error;
    } else if (priority <= this._warningThreshold) {
      level = vscode.DiagnosticSeverity.Warning;
    } else {
      level = vscode.DiagnosticSeverity.Information;
    }

    let problem = new vscode.Diagnostic(
      new vscode.Range(new vscode.Position(lineNum, 0), new vscode.Position(lineNum, 100)),
      msg,
      level
    );
    problem.code = { target: vscode.Uri.parse(uri), value: result.rule };
    problem.source = 'apex pmd';
    return problem;
  }

  checkPmdPath(): boolean {
    if (dirExists(this._pmdPath)) {
      return true;
    }
    this._outputChannel.appendLine(this._pmdPath);
    vscode.window.showErrorMessage('PMD Path Does not reference a valid directory.  Please update or clear');
    return false;
  }

  checkRulesetPath(rulesetPath: string): boolean {
    if (fileExists(rulesetPath)) {
      return true;
    }
    vscode.window.showErrorMessage(`No Ruleset not found at ${rulesetPath}. Ensure configuration correct or change back to the default.`);
    return false;
  }
}
