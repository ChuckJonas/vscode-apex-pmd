# apex-pmd

Allows you to run [Apex Static Analysis](http://pmd.sourceforge.net/snapshot/pmd-apex/) directly in vscode.

## Features

![Apex PMD](https://raw.githubusercontent.com/ChuckJonas/vscode-apex-pmd/master/images/apex-pmd.gif)

### Current actions Supported

* Run analysis on file open
* Run analysis on file save
* Run analysis on entire workspace
* Run analysis on single file
* Ability to define your own ruleset

## Installation

1. Must have `JDK >=1.4` installed and in path

## Configuration

``` javascript
    // Set to false to use you own ruleset (set path)
    "apexPMD.useDefaultRuleset": true,

    // Path to ruleset xml file.  Must also set `useDefaultRuleset:false`.
    // If relative - current workspace root dir is used as a starting point
    "apexPMD.rulesetPath": "",

    // Will run static analysis every time a file is opened
    "apexPMD.runOnFileOpen": true,

    // Will run static analysis every time a file is saved
    "apexPMD.runOnFileSave": true,

    // Determines at what priority level 'errors' will be added. Anything less will be a warning or hint
    "apexPMD.priorityErrorThreshold": 1,

    // Determines at what priority level 'warnings' will be added. Anything less will be a hint
    "apexPMD.priorityWarnThreshold": 3

    // optionally override PMD (set to extracted path of bin)
    "apexPMD.pmdPath": "",
```

### Defining your own "Ruleset"

I recommend you use the [default ruleset](https://github.com/ChuckJonas/vscode-apex-pmd/blob/master/rulesets/apex_ruleset.xml) as a starting point.

Set `"apexPMD.useDefaultRuleset": false` and update `apexPMD.rulesetPath` to reference your custom ruleset.

[Apex Ruleset Reference](http://pmd.sourceforge.net/snapshot/pmd-apex/rules/index.html#Default_ruleset_used_by_the_CodeClimate_Engine_for_Salesforce.com_Apex)


## Legal Stuff

To make configuration easier, this package now includes the PMD binaries.

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

The full license (BSD-style) can be found @ `/out/pmd/license`