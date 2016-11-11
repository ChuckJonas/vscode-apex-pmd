import * as vscode from 'vscode';
import * as ChildProcess from 'child_process'
import * as fs from 'fs';

export class ApexPmd{
    private _pmdPath: string;
    private _rulesetPath: string;
    private _errorThreshold: number;
    private _warningThreshold: number;

    public constructor(pmdPath: string, defaultRuleset: string, errorThreshold: number, warningThreshold: number){
        this._rulesetPath = defaultRuleset;
        this._pmdPath = pmdPath;
        this._errorThreshold = errorThreshold;
        this._warningThreshold = warningThreshold;
    }

    public run(targetPath: string, collection: vscode.DiagnosticCollection){
        if(!this.checkPmdPath() || !this.checkRulesetPath()) return;

        let cmd = this.createPMDCommand(targetPath);
        console.log(cmd);

        ChildProcess.exec(cmd, (error, stdout, stderr) => {
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
                }catch(ex){}
            }
            problemsMap.forEach(function(value, key){
                collection.set(vscode.Uri.file(key) , value);
            });
        });
    }

    createDiagonistic(line: String): vscode.Diagnostic{
        //format: "Problem","Package","File","Priority","Line","Description","Ruleset","Rule"
        let parts = line.split(',');
        let lineNum = parseInt(JSON.parse(parts[4])) - 1;
        let msg = JSON.parse(parts[5]);
        let priority = parseInt(JSON.parse(parts[3]));
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
        return JSON.parse(parts[2]);
    }

    createPMDCommand(targetPath: String) : string{
        return `java -cp '${this._pmdPath}/lib/*' net.sourceforge.pmd.PMD -d '${targetPath}' -f csv -R '${this._rulesetPath}'`;
    }

    checkPmdPath(): boolean{
        if(this.dirExists(this._pmdPath)){
            return true;
        }
        vscode.window.showErrorMessage('PMD Path not set. Please see Installation Instructions.');
        return false;
    }

    checkRulesetPath(): boolean{
        if(this.fileExists(this._rulesetPath)){
            return true;
        }
        vscode.window.showErrorMessage('Specified Ruleset not found. Make sure configuration is referencing a file or change back to the default.');
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
}



