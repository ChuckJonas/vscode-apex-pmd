# vscode Apex Pmd

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/chuckjonas.apex-pmd) ![Visual Studio Marketplace Installs - Azure DevOps Extension](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/chuckjonas.apex-pmd)](https://marketplace.visualstudio.com/items?itemName=chuckjonas.apex-pmd)
[![Open VSX Version](https://img.shields.io/open-vsx/v/pmd/apex-pmd)](https://open-vsx.org/extension/pmd/apex-pmd)
[![Open VSX Downloads](https://img.shields.io/open-vsx/dt/pmd/apex-pmd)](https://open-vsx.org/extension/pmd/apex-pmd)
[![build](https://github.com/ChuckJonas/vscode-apex-pmd/actions/workflows/build.yml/badge.svg)](https://github.com/ChuckJonas/vscode-apex-pmd/actions/workflows/build.yml)
[![Build Status](https://travis-ci.org/ChuckJonas/vscode-apex-pmd.svg?branch=master)](https://travis-ci.org/ChuckJonas/vscode-apex-pmd)

Allows you to run [Apex Static Analysis](https://pmd.github.io/latest/index.html) directly in vscode on Apex, VisualForce & other XML metadata files.

## Features

To start the command you can click in the menu on `Help/Show All Commands` or press the hotkey <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> and type `Apex`.

![Apex PMD](https://raw.githubusercontent.com/ChuckJonas/vscode-apex-pmd/master/images/apex-pmd.gif)

### Current actions Supported

- Run analysis on file open
- Run analysis on file save
- Run analysis on file change (new!)
- Run analysis on entire workspace
- Run analysis on single file
- Ability to define your own ruleset

## System Requirements

- Must have JRE >= 1.8 installed and in path
- See [PMD System Requirements](https://docs.pmd-code.org/latest/pmd_userdocs_installation.html#requirements) for more details

## Configuration

- `rulesets` (optional): set to override default ruleset (see "Defining your own ruleset" for more details)
- `runOnFileOpen`: run every time a file is opened in vscode
- `runOnFileSave`: run every time a file is saved
- `runOnFileChange`: Run when a file is changed. NOTE: this is "debounced" to prevent performance issues. Delay can be adjusted via `onFileChangeDebounce`.
- `priorityErrorThreshold`: Determines at what priority level 'errors' will be added. Anything less will be a warning or hint
- `priorityWarnThreshold`: Determines at what priority level 'warnings' will be added. Anything less will be a hint
- `enableCache`: Creates a cache file for PMD to run faster. Will create a .pmdCache file in your workspace
- `pmdBinPath` (prev. `pmdPath`) (optional): set to override the default pmd binaries. This should point to the PMD folder which contains folders `lib` and `bin`. Most likely it is called `libexec`. **WARNING: Since `v0.6.0`, this extension no longer supports PMD 6x. If you receive an error, please clear this setting!**
- `additionalClassPaths` (optional): set of paths to be appended to classpath. Used to find jar files containing custom rule definitions. Can be absolute or relative to workspace.
- `commandBufferSize` Size of buffer used to collect PMD command output (MB), may need to be increased for very large projects
- `jrePath` (Optional) Path to JRE (Folder that contains which contains `bin/java`)
- `apexRootDirectory` (optional, since 0.9.0): Whether and how to set `PMD_APEX_ROOT_DIRECTORY` env variable. This
   variable should point to the sfdx project directory, which contains the file `sfdx-project.json`.  
   
   This is needed for the rule [UnusedMethod](https://docs.pmd-code.org/latest/pmd_rules_apex_design.html#unusedmethod)
   which utilizes [Apex Language Server](https://github.com/apex-dev-tools/apex-ls) which needs a well-formed sfdx
   project.  
   * off = Do not set `PMD_APEX_ROOT_DIRECTORY` at all
   * automatic = (default) Automatically find the nearest `sfdx-project.json` file in a parent directory and use
     that directory
   * custom = Use a custom location for `PMD_APEX_ROOT_DIRECTORY` provided by "customValue". It should point to the
     directory where the `sfdx-project.json` file is located. This is only used, if the "mode"=="custom".
- `enableDebugOutput`: Logs PMD's debug messages to help troubleshooting.

### Defining your own "Ruleset"

I recommend you use the [default ruleset](https://github.com/ChuckJonas/vscode-apex-pmd/blob/master/rulesets/apex_ruleset.xml) as a starting point.

Set `apexPMD.rulesets` string array to reference your custom rulesets. You can either use the absolute paths, or a relative paths from your workspace (EG `my-apex-rules.xml`).

You can also mention the default ruleset in `apexPMD.rulesets`. To do this add `default` value to the array.

[Apex Ruleset Reference](https://docs.pmd-code.org/latest/pmd_rules_apex.html)

NOTE: If you move away from the default ruleset in an sfdx project, make sure to exclude the `.sfdx` generated classes by keeping this line:

`<exclude-pattern>.*/.sfdx/.*</exclude-pattern>`

### Using custom rules written in Java

If you want to use your own [custom rules](https://docs.pmd-code.org/latest/pmd_userdocs_extending_writing_pmd_rules.html) from a jar file, then the jar file must be on the classpath. By default, the PMD folder and the workspace root folder are included in the classpath. You can add further folders using the `additionalClassPaths` setting. This ["Hello world"](https://github.com/andrewgilbertsagecom/pmd-custom-rule-sample) example is a good starting place for beginners.

## Troubleshooting

The plugin creates an own output channel "Apex PMD" in the output view. This shows the output of the PMD command that is executed in the background.
In case of any problem, this output channel might contain the underlying error. When reporting an issue, please include any error messages from
this output channel.

## Developing/Contributing

### Prerequisites

- node
- bash: npm calls shell scripts and therefore bash is needed. Under Windows, make sure to run npm from within git-bash.
- java: needs to be installed already. It is needed for executing PMD later on.

### Setup & Run

1. `git clone`
1. `npm install`
1. debug -> `run extension`

### Creating a installable vsix package

`npm run vscode:package`

This will create a file "apex-pmd-<version>.vsix", which can be directly installed in VS Code.

### Executing automated tests

`npm run test`

### Upgrading PMD

`npm run update-pmd`

This will check for the latest PMD version on github and update `config.pmdVersion` in `package.json`.

## Legal Stuff

Copyright (c) 2020 Charles Jonas and Contributors

### PMD License

Contains Distribution of PMD library.

```
Copyright (c) 2003-2009, InfoEther, LLC
All rights reserved.

This product includes software developed in part by support from
the Defense Advanced Research Project Agency (DARPA)

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

The full license (BSD-style) can be found in the [PMD repo](https://github.com/pmd/pmd/blob/master/LICENSE)
