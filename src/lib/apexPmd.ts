import * as vscode from 'vscode';
import * as ChildProcess from 'child_process'
import * as fs from 'fs';
import * as path from 'path';
import { AppStatus } from './appStatus'

export class ApexPmd {
    private _pmdPath: string;
    private _rulesetPath: string;
    private _errorThreshold: number;
    private _warningThreshold: number;
    private _outputChannel: vscode.OutputChannel;
    private _showErrors: boolean;
    private _showStdOut: boolean;
    private _showStdErr: boolean;

    public constructor(outputChannel: vscode.OutputChannel, pmdPath: string, defaultRuleset: string, errorThreshold: number, warningThreshold: number, showErrors: boolean, showStdOut: boolean, showStdErr: boolean) {
        this._rulesetPath = defaultRuleset;
        this._pmdPath = pmdPath;
        this._errorThreshold = errorThreshold;
        this._warningThreshold = warningThreshold;
        this._outputChannel = outputChannel;
        this._showErrors = showErrors;
        this._showStdOut = showStdOut;
        this._showStdErr = showStdErr;
    }


    public async run(targetPath: string, collection: vscode.DiagnosticCollection, progress?: vscode.Progress<{ message?: string; increment?: number; }>, token?: vscode.CancellationToken): Promise<void> {
        this._outputChannel.appendLine(`Analysing ${targetPath}`);
        AppStatus.getInstance().thinking();

        let canceled = false;
        token && token.onCancellationRequested(() => {
            canceled = true;
        });

        if (!this.checkPmdPath() || !this.checkRulesetPath()) return;

        let data = await this.executeCmd(targetPath, token);
        let problemsMap = this.parseProblems(data);

        if (problemsMap.size > 0) {
            AppStatus.getInstance().errors();
            progress && progress.report({ message: `Processing ${problemsMap.size} file(s)`});
            
            let increment = 1 / problemsMap.size * 100;

            for (var [path, issues] of problemsMap) {
                if (canceled) {
                    return;
                }
                
                progress && progress.report({increment});

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
    }

    async executeCmd(targetPath: string, token?: vscode.CancellationToken): Promise<string> {
        let cmd = `java -cp "${path.join(this._pmdPath, 'lib', '*')}" net.sourceforge.pmd.PMD -d "${targetPath}" -f csv -R "${this._rulesetPath}"`;
        if (this._showStdOut) this._outputChannel.appendLine('PMD Command: ' + cmd);

        let pmdCmd = ChildProcess.exec(cmd);
        
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
                pmdCmd.addListener("exit", () => { resolve(stdout) });
                pmdCmd.stdout.on('data', (m: string) => {
                    if (this._showStdOut) this._outputChannel.appendLine('stdout:' + m);
                    stdout += m;
                });
                pmdCmd.stderr.on('data', (m: string) => {
                    if (this._showStdErr) this._outputChannel.appendLine('stderr:' + m);
                });
            }
        )
        return pmdPromise;
    }

    parseProblems(csv: string): Map<string, Array<vscode.Diagnostic>> {
        let lines = csv.split('\n');
        this._outputChannel.appendLine(`${lines.length-2} issue(s) found`);
        let problemsMap = new Map<string, Array<vscode.Diagnostic>>();
        for (let i = 0; i < lines.length; i++) {
            try {
                if (!lines[i]) continue;
                let file = this.getFilePath(lines[i]);

                let problem = this.createDiagonistic(lines[i]);
                if (!problem) continue;

                if (problemsMap.has(file)) {
                    problemsMap.get(file).push(problem);
                } else {
                    problemsMap.set(file, [problem]);
                }
            } catch (ex) {
                if (this._showErrors) this._outputChannel.appendLine(ex);
            }
        }
        return problemsMap;
    }

    //format: "Problem","Package","File","Priority","Line","Description","Ruleset","Rule"
    createDiagonistic(line: String): vscode.Diagnostic {
        let parts = line.split(',');
        let lineNum = parseInt(this.stripQuotes(parts[4])) - 1;
        let msg = this.stripQuotes(parts[5]);
        let priority = parseInt(this.stripQuotes(parts[3]));
        if (isNaN(lineNum)) { return null; }

        let level: vscode.DiagnosticSeverity;
        if (priority <= this._errorThreshold) {
            level = vscode.DiagnosticSeverity.Error;
        } else if (priority <= this._warningThreshold) {
            level = vscode.DiagnosticSeverity.Warning;
        } else {
            level = vscode.DiagnosticSeverity.Hint;
        }

        let problem = new vscode.Diagnostic(
            new vscode.Range(new vscode.Position(lineNum, 0), new vscode.Position(lineNum, 100)),
            msg,
            level
        );
        return problem;
    }

    getFilePath(line: String): string {
        let parts = line.split(',');
        return this.stripQuotes(parts[2]);
    }

    checkPmdPath(): boolean {
        if (this.dirExists(this._pmdPath)) {
            return true;
        }
        this._outputChannel.appendLine(this._pmdPath);
        vscode.window.showErrorMessage('PMD Path Does not reference a valid directory.  Please update or clear');
        return false;
    }

    checkRulesetPath(): boolean {
        if (this.fileExists(this._rulesetPath)) {
            return true;
        }
        vscode.window.showErrorMessage(`No Ruleset not found at ${this._rulesetPath}. Ensure configuration correct or change back to the default.`);
        return false;
    }

    //=== Util ===
    fileExists(filePath: string) {
        try {
            let stat = fs.statSync(filePath);
            return stat.isFile();
        } catch (err) {
            return false;
        }
    }

    dirExists(filePath: string) {
        try {
            let stat = fs.statSync(filePath);
            return stat.isDirectory();
        } catch (err) {
            return false;
        }
    }

    stripQuotes(s: string): string {
        return s.substr(1, s.length - 2);
    }
}
