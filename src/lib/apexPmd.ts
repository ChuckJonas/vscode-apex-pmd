import * as vscode from 'vscode';
import * as ChildProcess from 'child_process'
import * as fs from 'fs';
import * as path from 'path';

export class ApexPmd{
    private _pmdPath: string;
    private _rulesetPath: string;
    private _errorThreshold: number;
    private _warningThreshold: number;
    private _outputChannel: vscode.OutputChannel;
    private _showErrors : boolean;
    private _showStdOut : boolean;
    private _showStdErr : boolean;

    public constructor(outputChannel: vscode.OutputChannel, pmdPath: string, defaultRuleset: string, errorThreshold: number, warningThreshold: number, showErrors : boolean, showStdOut : boolean, showStdErr : boolean){
        this._rulesetPath = defaultRuleset;
        this._pmdPath = pmdPath;
        this._errorThreshold = errorThreshold;
        this._warningThreshold = warningThreshold;
        this._outputChannel = outputChannel;
        this._showErrors = showErrors;
        this._showStdOut = showStdOut;
        this._showStdErr = showStdErr;
    }

    public run(targetPath: string, collection: vscode.DiagnosticCollection){
        if(!this.checkPmdPath() || !this.checkRulesetPath()) return;

        let cmd = this.createPMDCommand(targetPath);
        if(this._showStdOut) this._outputChannel.appendLine('PMD Command: ' + cmd);

        ChildProcess.exec(cmd, (error, stdout, stderr) => {
            if(this._showErrors) this._outputChannel.appendLine('error:' +  error);
            if(this._showStdOut) this._outputChannel.appendLine('stdout:' +  stdout);
            if(this._showStdErr) this._outputChannel.appendLine('stderr:' +  stderr);

            let lines = stdout.split('\n');
            let problemsMap = new Map<string,Array<vscode.Diagnostic>>();
            for(let i = 0; i < lines.length; i++){
                try{
                    let file = this.getFilePath(lines[i]);

                    let problem = this.createDiagonistic(lines[i]);
                    if(!problem) continue;

                    if(problemsMap.has(file)){
                        problemsMap.get(file).push(problem);
                    }else{
                        problemsMap.set(file,[problem]);
                    }
                }catch(ex){
                    if(this._showErrors) this._outputChannel.appendLine(ex);
                }
            }
            problemsMap.forEach(function(value, key){
                let uri = vscode.Uri.file(key);
                vscode.workspace.openTextDocument(uri).then(doc => {
                    //fix ranges to not include whitespace
                    for(let i = 0; i < value.length; i++){
                        let prob = value[i];
                        let line = doc.lineAt(prob.range.start.line);
                        prob.range = new vscode.Range(
                                        new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex),
                                        line.range.end
                                    );
                    }
                    collection.delete(uri);
                    collection.set(uri , value);
                }, reason => {
                    console.log(reason);
                    if(this._showStdOut) this._outputChannel.appendLine(reason);
                });


            });
        });
    }

    createDiagonistic(line: String): vscode.Diagnostic{
        //format: "Problem","Package","File","Priority","Line","Description","Ruleset","Rule"
        let parts = line.split(',');
        let lineNum = parseInt(this.stripQuotes(parts[4])) - 1;
        let msg = this.stripQuotes(parts[5]);
        let priority = parseInt(this.stripQuotes(parts[3]));
        if(isNaN(lineNum)){return null;}

        let level: vscode.DiagnosticSeverity;
        if(priority <= this._errorThreshold){
            level = vscode.DiagnosticSeverity.Error;
        }else if(priority <= this._warningThreshold){
            level = vscode.DiagnosticSeverity.Warning;
        }else{
            level = vscode.DiagnosticSeverity.Hint;
        }

        let problem = new vscode.Diagnostic(
            new vscode.Range(new vscode.Position(lineNum,0),new vscode.Position(lineNum,100)),
            msg,
            level
        );
        return problem;
    }

    getFilePath(line: String): string{
        let parts = line.split(',');
        return this.stripQuotes(parts[2]);
    }

    createPMDCommand(targetPath: String) : string{
        return `java -cp "${path.join(this._pmdPath,'lib','*')}" net.sourceforge.pmd.PMD -d "${targetPath}" -f csv -R "${this._rulesetPath}"`;
    }

    checkPmdPath(): boolean{
        if(this.dirExists(this._pmdPath)){
            return true;
        }
        this._outputChannel.appendLine(this._pmdPath);
        vscode.window.showErrorMessage('PMD Path not set. Please see Installation Instructions.');
        return false;
    }

    checkRulesetPath(): boolean{
        if(this.fileExists(this._rulesetPath)){
            return true;
        }
        vscode.window.showErrorMessage(`No Ruleset not found at ${this._rulesetPath}. Ensure configuration correct or change back to the default.`);
        return false;
    }

    //=== Util ===
    fileExists(filePath){
        try{
            let stat = fs.statSync(filePath);
            return stat.isFile();
        }catch (err){
            return false;
        }
    }

    dirExists(filePath){
        try{
            let stat = fs.statSync(filePath);
            return stat.isDirectory();
        }catch (err){
            return false;
        }
    }

    stripQuotes(s : string): string{
        return s.substr(1, s.length-2);
    }
}



