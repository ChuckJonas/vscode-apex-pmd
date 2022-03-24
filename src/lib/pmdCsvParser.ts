import { parse } from 'csv-parse/sync';
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
  const parseOpts = {
    columns: PMD_COLUMNS,
    // eslint-disable-next-line @typescript-eslint/camelcase
    relax_column_count: true,
  };
  try {
    results = parse(csv, parseOpts);
  } catch (e) {
    //try to recover parsing... remove last ln and try again
    const lines = csv.split(EOL);
    lines.pop();
    csv = lines.join(EOL);
    try {
      results = parse(csv, parseOpts);
    } catch (e) {
      throw new Error(
        'Failed to parse PMD Results.  Enable please logging (STDOUT & STDERROR) and submit an issue if this problem persists.'
      );
    }
    vscode.window.showWarningMessage('Failed to read all PMD problems!');
  }
  return results;
}
