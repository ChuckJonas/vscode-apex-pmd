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

export function parsePmdCsv(csv: string, outputChannel: vscode.LogOutputChannel): Array<PmdResult> {
  let results: PmdResult[];
  const parseOpts = {
    columns: PMD_COLUMNS,
    relax_column_count: true,
  };
  try {
    results = parse(csv, parseOpts);
  } catch (e1) {
    outputChannel.error("Error while parsing CSV, trying to recover. " + e1);
    //try to recover parsing... remove last ln and try again
    const lines = csv.split(EOL);
    lines.pop();
    csv = lines.join(EOL);
    try {
      results = parse(csv, parseOpts);
    } catch (e2) {
      outputChannel.error("Error while parsing CSV. " + e2);
      throw new Error(
        'Failed to parse PMD Results. Please submit an issue with the output from the "Apex PMD" output channel if this problem persists.'
      );
    }
    vscode.window.showWarningMessage('Failed to read all PMD problems!');
  }
  return results;
}
