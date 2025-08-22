import * as vscode from 'vscode';
import * as ChildProcess from 'child_process';
import * as path from 'path';
import { Config } from './config';
import { AppStatus } from './appStatus';
import * as os from 'os';
import { fileExists, dirExists, findSfdxProject } from './utils';

//setup OS constants
const CLASSPATH_DELM = os.platform() === 'win32' ? ';' : ':';

export class ApexPmd {
  private config: Config;
  private rulesets: string[];
  private outputChannel: vscode.LogOutputChannel;

  public constructor(outputChannel: vscode.LogOutputChannel, config: Config) {
    this.config = config;
    this.rulesets = this.getValidRulesetPaths(config.rulesets);
    this.outputChannel = outputChannel;
  }

  public updateConfiguration(config: Config) {
    this.config = config;
    this.rulesets = this.getValidRulesetPaths(config.rulesets);
  }

  public async run(
    targetPath: string,
    collection: vscode.DiagnosticCollection,
    progress?: vscode.Progress<{ message?: string; increment?: number }>,
    token?: vscode.CancellationToken
  ): Promise<void> {
    this.outputChannel.info('###################################');
    this.outputChannel.info(`Analyzing ${targetPath}`);
    AppStatus.getInstance().thinking();

    let canceled = false;
    if (token) {
      token.onCancellationRequested(() => {
        canceled = true;
      });
    }

    if (!this.checkPmdPath() || !this.hasAtLeastOneValidRuleset()) return;

    try {
      const data = await this.executeCmd(targetPath, token);
      const problemsMap = this.parseProblems(data);

      if (problemsMap.size > 0) {
        AppStatus.getInstance().errors();
        if (progress) {
          progress.report({
            message: `Processing ${problemsMap.size} file(s)`,
          });
        }

        const increment = (1 / problemsMap.size) * 100;

        for (const [path, issues] of problemsMap) {
          if (canceled) {
            return;
          }

          if (progress) {
            progress.report({ increment });
          }

          try {
            const uri = vscode.Uri.file(path);
            const doc = await vscode.workspace.openTextDocument(uri);
            //fix ranges to not include whitespace
            issues.forEach((issue) => {
              const line = doc.lineAt(issue.range.start.line);
              issue.range = new vscode.Range(
                new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex),
                line.range.end
              );
            });

            collection.set(uri, issues);
          } catch (e) {
            this.outputChannel.error(e);
          }
        }
      } else {
        const uri = vscode.Uri.file(targetPath);
        collection.delete(uri);
        AppStatus.getInstance().ok();
      }
    } catch (e) {
      AppStatus.getInstance().errors();
      vscode.window.showErrorMessage(`Static Analysis Failed. Error Details: ${e}`);
      this.outputChannel.show(true);
      // should this throw e for promise catch?
    }
  }

  public getRulesets() {
    return this.rulesets;
  }

  getValidRulesetPaths(rulesets: string[]) {
    const validRulesets = rulesets.filter((p) => this.checkRulesetPath(p));
    return validRulesets;
  }

  hasAtLeastOneValidRuleset() {
    if (this.rulesets.length) {
      return true;
    }
    const msg = `No valid Ruleset paths found in "apexPMD.rulesets". Ensure configuration correct or change back to the default.`;
    this.outputChannel.warn(msg);
    vscode.window.showErrorMessage(msg);
    return false;
  }

  async executeCmd(targetPath: string, token?: vscode.CancellationToken): Promise<string> {
    const { workspaceRootPath, enableCache, pmdBinPath, additionalClassPaths, commandBufferSize, apexRootDirectory } =
      this.config;

    // -R Comma-separated list of ruleset or rule references.
    const cachePath = `${workspaceRootPath}/.pmdCache`;
    const rulesetsArg = this.rulesets.join(',');

    const cacheKey = enableCache ? `--cache "${cachePath}"` : '--no-cache';
    const noProgressBar = '--no-progress';
    const formatKey = `-f json`;
    const targetPathKey = `-d "${targetPath}"`;
    const rulesetsKey = `-R "${rulesetsArg}"`;
    const debugMode = this.config.enableDebugOutput ? '--debug' : '';

    const pmdKeys = `${noProgressBar} ${debugMode} ${formatKey} ${cacheKey} ${targetPathKey} ${rulesetsKey}`;

    const classPath = [path.join(workspaceRootPath, '*'), ...additionalClassPaths].join(CLASSPATH_DELM);

    let env: NodeJS.ProcessEnv = {};
    if (this.config.jrePath) {
      env['PATH'] = `${path.join(this.config.jrePath, 'bin')}`;
    }

    switch (apexRootDirectory.mode) {
      case 'automatic':
        env['PMD_APEX_ROOT_DIRECTORY'] = findSfdxProject(targetPath, workspaceRootPath);
        break;
      case 'custom':
        env['PMD_APEX_ROOT_DIRECTORY'] = apexRootDirectory.customValue ?? '';
        break;
    }

    const cmd = `java -cp "${path.join(pmdBinPath, 'lib')}${path.sep}*${path.delimiter}${classPath}" net.sourceforge.pmd.cli.PmdCli check ${pmdKeys}`;

    this.outputChannel.debug(`node: ${process.version}`);
    this.outputChannel.debug(`custom env: ${JSON.stringify(env)}`);
    this.outputChannel.debug('PMD Command: ' + cmd);

    const pmdCmd = ChildProcess.exec(cmd, {
      env: { ...process.env, ...env }, // provides default env and maybe overwrites PATH
      maxBuffer: Math.max(commandBufferSize, 1) * 1024 * 1024,
    });

    if (token) {
      token.onCancellationRequested(() => {
        pmdCmd.kill();
      });
    }

    let stdout = '';
    let stderr = '';
    const pmdPromise = new Promise<string>((resolve, reject) => {
      pmdCmd.addListener('error', (e) => {
        this.outputChannel.error('error:' + e);
        reject(e);
      });
      pmdCmd.addListener('exit', (e) => {
        if (e !== 0 && e !== 4) {
          this.outputChannel.error(`Failed Exit Code: ${e}`);
          if (stderr.includes('Cannot load ruleset')) {
            reject('PMD Command Failed!  There is a problem with the ruleset. Check the plugin output for details.');
          }
          if (!stdout) {
            reject('PMD Command Failed!  Check the plugin output for details.');
          }
        }
        resolve(stdout);
      });
      pmdCmd.stdout.on('data', (m: string) => {
        this.outputChannel.debug('stdout:' + m);
        stdout += m;
      });
      pmdCmd.stderr.on('data', (m: string) => {
        this.outputChannel.debug('stderr:' + m);
        stderr += m;
      });
    });
    return pmdPromise;
  }

  parseProblems(csv: string): Map<string, Array<vscode.Diagnostic>> {
    const results = this.mapPmdToResult(csv);

    const problemsMap = new Map<string, Array<vscode.Diagnostic>>();
    let problemCount = 0;

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (!result) continue;

      // skip .sfdx files
      if (result.file.endsWith('.sfdx')) continue;

      const problem = this.createDiagnostic(result);
      if (!problem) continue;

      problemCount++;
      if (problemsMap.has(result.file)) {
        problemsMap.get(result.file)!.push(problem);
      } else {
        problemsMap.set(result.file, [problem]);
      }
    }
    this.outputChannel.info(`${problemCount} issue(s) found`);
    return problemsMap;
  }

  createDiagnostic(result: PmdResult): vscode.Diagnostic {
    const { priorityErrorThreshold, priorityWarnThreshold } = this.config;
    const lineNum = parseInt(result.line) - 1;
    let uri = '';
    const msg = `${result.description} (rule: ${result.ruleSet}-${result.rule})`;
    const externalURL = result.externalURL;
    if (externalURL != undefined) {
      uri = externalURL.startsWith('http') ? externalURL : 'https://' + externalURL;
    } else {
      uri = `https://pmd.github.io/latest/pmd_rules_apex_${result.ruleSet
        .split(' ')
        .join('')
        .toLowerCase()}.html#${result.rule.toLowerCase()}`;
    }
    const priority = parseInt(result.priority);
    if (isNaN(lineNum)) {
      return null;
    }

    let level: vscode.DiagnosticSeverity;
    if (priority <= priorityErrorThreshold) {
      level = vscode.DiagnosticSeverity.Error;
    } else if (priority <= priorityWarnThreshold) {
      level = vscode.DiagnosticSeverity.Warning;
    } else {
      level = vscode.DiagnosticSeverity.Information;
    }

    const problem = new vscode.Diagnostic(
      new vscode.Range(new vscode.Position(lineNum, 0), new vscode.Position(lineNum, 100)),
      msg,
      level
    );
    problem.code = { target: vscode.Uri.parse(uri), value: result.rule };
    problem.source = 'apex pmd';
    return problem;
  }

  checkPmdPath(): boolean {
    const { pmdBinPath } = this.config;

    if (dirExists(pmdBinPath)) {
      return true;
    }

    const msg = `pmdBinPath does not reference a valid directory: '${pmdBinPath}'. Please update or clear.`;
    this.outputChannel.error(msg);
    vscode.window.showErrorMessage(msg);
    return false;
  }

  checkRulesetPath(rulesetPath: string): boolean {
    if (fileExists(rulesetPath)) {
      return true;
    }
    vscode.window.showErrorMessage(
      `No Ruleset not found at ${rulesetPath}. Ensure configuration correct or change back to the default.`
    );
    return false;
  }

  mapPmdToResult(jsonString: string): PmdResult[] {
    const report: PmdReport = JSON.parse(jsonString);

    const results: PmdResult[] = [];

    report.files.forEach((file) => {
      file.violations.forEach((violation) => {
        results.push({
          problem: violation.rule,
          package: '',
          file: file.filename,
          priority: violation.priority.toString(),
          line: violation.beginline.toString(),
          description: violation.description,
          ruleSet: violation.ruleset,
          rule: violation.rule,
          externalURL: violation.externalInfoUrl,
        });
      });
    });

    return results;
  }
}
