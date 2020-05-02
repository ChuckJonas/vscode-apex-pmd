import * as parser from 'csv-parse/lib/sync';
import { Options } from 'csv-parse';
import { EOL } from 'os';
import * as vscode from 'vscode';

const PMD_COLUMNS: (keyof PmdResult)[] = [
  'problem',
  'package',
  'file',
  'priority',
  'line',
  'description',
  'ruleSet',
  'rule'
];

export function parsePmdCsv(csv: string): Array<PmdResult> {

  let results: PmdResult[];
  let parseOpts: Options = {
    columns: PMD_COLUMNS,
    relax_column_count: true
  };
  try {
    results = parser(csv, parseOpts);
  } catch (e) {
    //try to recover parsing... remove last ln and try again
    let lines = csv.split(EOL);
    lines.pop();
    csv = lines.join(EOL);
    try {
      results = parser(csv, parseOpts);
    } catch (e) {
      throw new Error('Failed to parse PMD Results.  Enable please logging (STDOUT & STDERROR) and submit an issue if this problem persists.');
    }
    vscode.window.showWarningMessage('Failed to read all PMD problems!');
  }
  return results;
}

//   let problemsMap = new Map<string, Array<vscode.Diagnostic>>();
//   let problemCount = 0;

//   for (let i = 1; i < results.length; i++) {
//       try {

//           let result = results[i];
//           if (!results[i]) continue;

//           //skip .sfdx files
//           if (result.file.includes('.sfdx')) {
//               continue;
//           }

//           let problem = this.createDiagnostic(result);
//           if (!problem) continue;

//           problemCount++;
//           if (problemsMap.has(result.file)) {
//               problemsMap.get(result.file).push(problem);
//           } else {
//               problemsMap.set(result.file, [problem]);
//           }
//       } catch (ex) {
//           this._outputChannel.appendLine(ex);
//       }
//   }
//   this._outputChannel.appendLine(`${problemCount} issue(s) found`);
//   return problemsMap;
// }
