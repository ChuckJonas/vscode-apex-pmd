import * as vscode from 'vscode';
import * as ChildProcess from 'child_process'
import * as fs from 'fs';

export class ApexPmd{
    private _pmdPath: string;

    public constructor(){
        let config = vscode.workspace.getConfiguration('apexPMD');
        this._pmdPath = config.get('pmdPath').toString();
    }

    public run(targetPath: string, collection: vscode.DiagnosticCollection){
        if(!this.checkPmdPath()) return;

        let cmd = this.createPMDCommand(targetPath);
        console.log(cmd);
        vscode.window.showInformationMessage(`Running Static Anaylsis on ${targetPath}...`);

        console.log(`Start: ${new Date()}`);
        ChildProcess.exec(cmd, (error, stdout, stderr) => {
            console.log(`End: ${new Date()}`);
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

            vscode.window.showInformationMessage('Static Anaylsis Done!');
        });
    }

    createDiagonistic(line: String): vscode.Diagnostic{
        //"Problem","Package","File","Priority","Line","Description","Rule set","Rule"
        let parts = line.split(',');
        let lineNum = parseInt(JSON.parse(parts[4])) - 1;
        let msg = JSON.parse(parts[5]);
        if(isNaN(lineNum)){return null;}
        let problem = new vscode.Diagnostic(
            new vscode.Range(new vscode.Position(lineNum,0),new vscode.Position(lineNum,100)),
            msg,
            vscode.DiagnosticSeverity.Warning
        );
        return problem;
    }

    getFilePath(line: String): string{
        //"Problem","Package","File","Priority","Line","Description","Rule set","Rule"
        let parts = line.split(',');
        return JSON.parse(parts[2]);
    }

    createPMDCommand(targetPath: String) : string{
        return `${this._pmdPath}/run.sh pmd -d ${targetPath} -f csv -R apex-style,apex-apexunit,apex-complexity,apex-performance`;
    }

    checkPmdPath(): boolean{
        if(this.fileExists(`${this._pmdPath}/run.sh`)){
            return true;
        }
        vscode.window.showErrorMessage('PMD Path not set. Please see Installation Instructions.');
        return false;
    }

    fileExists(filePath){
        try{
            let stat = fs.statSync(filePath);
            return stat.isFile();
        }catch (err){
            return false;
        }
    }
}



