import * as vscode from 'vscode';
import * as ChildProcess from 'child_process';
import * as path from 'path';
import { Config } from './config';
import { AppStatus } from './appStatus';
import { fileExists, dirExists, findSfdxProject } from './utils';
import { parsePmdCsv } from './pmdCsvParser';

export class ApexPmd {
  private config: Config;
  private rulesets: string[];
  private outputChannel: vscode.OutputChannel;
  private pmdProcessCounter : number = 0;

  public constructor(outputChannel: vscode.OutputChannel, config: Config) {
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
    this.outputChannel.appendLine('###################################');
    this.outputChannel.appendLine(`  INFO:Analyzing ${targetPath}`);
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
            this.outputChannel.append(' ERROR:');
            this.outputChannel.appendLine(e);
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
    this.outputChannel.append(' ERROR:');
    this.outputChannel.appendLine(msg);
    vscode.window.showErrorMessage(msg);
    return false;
  }

  async executeCmd(targetPath: string, token?: vscode.CancellationToken): Promise<string> {
    const {
      workspaceRootPath,
      enableCache,
      pmdBinPath,
      additionalClassPaths,
      commandBufferSize,
      apexRootDirectory,
    } = this.config;

    if (this.config.limitPMDProcesses && this.pmdProcessCounter > 0) {
      const errorMessage = `There are already ${this.pmdProcessCounter} PMD processes running.`;
      this.outputChannel.append(" ERROR:");
      this.outputChannel.appendLine(errorMessage)
      throw new Error(errorMessage);
    }

    // -R Comma-separated list of ruleset or rule references.
    const cachePath = `${workspaceRootPath}/.pmdCache`;
    const rulesetsArg = this.rulesets.join(',');
    const classPath = [path.join(workspaceRootPath, '*'), ...additionalClassPaths].join(path.delimiter);

    const env : NodeJS.ProcessEnv = {};
    if (this.config.jrePath) {
      env["PATH"] = `${path.join(this.config.jrePath, 'bin')}`;
    }

    switch (apexRootDirectory.mode) {
      case "automatic":
        env["PMD_APEX_ROOT_DIRECTORY"] = findSfdxProject(targetPath, workspaceRootPath);
        break;
      case "custom":
        env["PMD_APEX_ROOT_DIRECTORY"] = apexRootDirectory.custom ?? '';
        break;
    }

    const args = ['-cp', `${path.join(pmdBinPath, 'lib')}${path.sep}*${path.delimiter}${classPath}`,
           'net.sourceforge.pmd.cli.PmdCli', 'check',
           '--no-progress',
           ...(enableCache ? ['--cache', cachePath] : ['--no-cache']),
           '-f', 'csv',
           '-d', targetPath,
           '-R', rulesetsArg
         ];
    const command = "java";
    const cmd = command + ' ' + args.map(s => s.indexOf(' ') > -1 ? `"${s}"` : s).join(' ');


    this.outputChannel.appendLine(` DEBUG:Node: ${process.version}`);
    this.outputChannel.appendLine(` DEBUG:Custom environment: ${JSON.stringify(env)}`);

    const startTime = Date.now();
    this.pmdProcessCounter++;
    this.outputChannel.appendLine(`  INFO:Starting PMD now: ${startTime} (running PMD processes: ${this.pmdProcessCounter})`);

    let pmdCmd;
    switch (this.config.childProcessMethod) {
      case "execFile":
        this.outputChannel.appendLine(` DEBUG:PMD Command (execFile): command=${command}, args=${args}`);
        pmdCmd = ChildProcess.execFile(command, args,
         {
          env: {...process.env, ...env}, // provides default env and maybe overwrites PATH
          maxBuffer: Math.max(commandBufferSize, 1) * 1024 * 1024,
         });
        break;
      case "spawn":
        this.outputChannel.appendLine(` DEBUG:PMD Command (spawn): command=${command}, args=${args}`);
        pmdCmd = ChildProcess.spawn(command, args,
         {
          env: {...process.env, ...env}, // provides default env and maybe overwrites PATH
         });
        break;
      default:
      case "exec":
        this.outputChannel.appendLine(' DEBUG:PMD Command (exec): ' + cmd);
        pmdCmd = ChildProcess.exec(cmd, {
          env: {...process.env, ...env}, // provides default env and maybe overwrites PATH
          maxBuffer: Math.max(commandBufferSize, 1) * 1024 * 1024,
        });
        break;
    }

    if (token) {
      token.onCancellationRequested(() => {
        pmdCmd.kill();
      });
    }

    let stdout = '';
    let stderr = '';
    const pmdPromise = new Promise<string>((resolve, reject) => {
      pmdCmd.addListener('error', (e) => {
        this.outputChannel.appendLine(' ERROR:' + e);
        this.pmdProcessCounter--;
        reject(e);
      });
      pmdCmd.addListener('exit', (e) => {
        this.pmdProcessCounter--;
        this.outputChannel.appendLine(`  INFO:PMD Exit code: ${e}. Duration: ${Date.now() - startTime} ms (running PMD processes: ${this.pmdProcessCounter})`);
        if (e !== 0 && e !== 4) {
          this.outputChannel.appendLine(` ERROR:Failed Exit Code: ${e}`);
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
        this.outputChannel.append('stdout:' + m);
        stdout += m;
      });
      pmdCmd.stderr.on('data', (m: string) => {
        this.outputChannel.append('stderr:' + m);
        stderr += m;
      });
    });
    return pmdPromise;
  }

  parseProblems(csv: string): Map<string, Array<vscode.Diagnostic>> {
    const results = parsePmdCsv(csv);

    const problemsMap = new Map<string, Array<vscode.Diagnostic>>();
    let problemCount = 0;

    for (let i = 1; i < results.length; i++) {
      try {
        const result = results[i];
        if (!results[i]) continue;

        //skip .sfdx files
        if (result.file.includes('.sfdx')) {
          continue;
        }

        const problem = this.createDiagnostic(result);
        if (!problem) continue;

        problemCount++;
        if (problemsMap.has(result.file)) {
          problemsMap.get(result.file).push(problem);
        } else {
          problemsMap.set(result.file, [problem]);
        }
      } catch (ex) {
        this.outputChannel.append(' ERROR:');
        this.outputChannel.appendLine(ex);
      }
    }
    this.outputChannel.appendLine(`  INFO:${problemCount} issue(s) found`);
    return problemsMap;
  }

  createDiagnostic(result: PmdResult): vscode.Diagnostic {
    const { priorityErrorThreshold, priorityWarnThreshold } = this.config;
    const lineNum = parseInt(result.line) - 1;

    const uri = `https://pmd.github.io/latest/pmd_rules_apex_${result.ruleSet
      .split(' ')
      .join('')
      .toLowerCase()}.html#${result.rule.toLowerCase()}`;
    const msg = `${result.description} (rule: ${result.ruleSet}-${result.rule})`;

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
    this.outputChannel.appendLine(' ERROR:');
    this.outputChannel.appendLine(msg);
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
}
