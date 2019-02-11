# vscode Apex Pmd

[![Build Status](https://travis-ci.org/ChuckJonas/vscode-apex-pmd.svg?branch=master)](https://travis-ci.org/ChuckJonas/vscode-apex-pmd)

Allows you to run [Apex Static Analysis](http://pmd.sourceforge.net/snapshot/pmd-apex/) directly in vscode on apex & visualforce files.

## Features

![Apex PMD](https://raw.githubusercontent.com/ChuckJonas/vscode-apex-pmd/master/images/apex-pmd.gif)

### Current actions Supported

- Run analysis on file open
- Run analysis on file save
- Run analysis on entire workspace
- Run analysis on single file
- Ability to define your own ruleset

## System Requirements

1. Must have `JDK >=1.4` installed and in path

## Configuration

- `rulesets`: set to override default ruleset (see "Defining your own ruleset" for more details)
- `runOnFileOpen`: run every time a file is opened in vscode
- `runOnFileSave`: run everytime a file is saved
- `priorityErrorThreshold`: Determines at what priority level 'errors' will be added. Anything less will be a warning or hint
- `priorityWarnThreshold`: Determines at what priority level 'warnings' will be added. Anything less will be a hint
- `pmdBinPath`: set to override the default pmd binaries. Previously named `pmdPath`.

### Defining your own "Ruleset"

I recommend you use the [default ruleset](https://github.com/ChuckJonas/vscode-apex-pmd/blob/master/rulesets/apex_ruleset.xml) as a starting point.

Set `apexPMD.rulesets` string array to reference your custom rulesets. You can either use the absolute paths, or a relative paths from your workspace (EG `my-apex-rules.xml`).

You can also mention the default ruleset in `apexPMD.rulesets`. To do this add `default` value to the array.

[Apex Ruleset Reference](https://pmd.github.io/pmd-6.11.0/pmd_rules_apex.html)

## Legal Stuff

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
