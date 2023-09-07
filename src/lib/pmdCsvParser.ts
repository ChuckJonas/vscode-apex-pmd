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
  'rule',
];

export function parsePmdCsv(csv: string): Array<PmdResult> {
  let results: PmdResult[];
  const parseOpts: Options = {
    columns: PMD_COLUMNS,
    // eslint-disable-next-line @typescript-eslint/camelcase
    relax_column_count: true,
  };
  try {
    results = parser(csv, parseOpts);
  } catch (e) {
    //try to recover parsing... remove last ln and try again
    const lines = csv.split(EOL);
    lines.pop();
    csv = lines.join(EOL);
    try {
      results = parser(csv, parseOpts);
    } catch (e) {
      throw new Error(
        'Failed to parse PMD Results. Please submit an issue with the output from the "Apex PMD" output channel if this problem persists.'
      );
    }
    vscode.window.showWarningMessage('Failed to read all PMD problems!');
  }
  return results;
}
