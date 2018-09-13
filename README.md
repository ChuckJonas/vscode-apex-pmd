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
2. Download a [PMD "bin" release](https://sourceforge.net/projects/pmd/files/pmd/) (`>= 6.0`)
3. unzip to location of choice
4. In VScode, Open `Preferences: User Settings` and set `apexPMD.pmdPath` to folder where pmd was unzipped in step 3

## Configuration

``` javascript
    // absolute path to where PMD was installed
    // For example : /Users/johndoe/pmd on macOS
    // C:\\Code\\pmd-bin-6.7.0 on windows
    "apexPMD.pmdPath": "/Users/johndoe/pmd", // on Mac 

    // Set to false to use you own ruleset (set path)
    "apexPMD.useDefaultRuleset": true,

    // Path to ruleset xml file.  Must also set `useDefaultRuleset:false`.
    // If relative - current workspace root dir is used as a starting point.
    // Path in this format for mac "apexPMD.rulesetPath": "/Users/johndoe/pmd"
    // in this format for Windows "apexPMD.rulesetPath": "C:\\Code\\ruleset\\apex_default.xml"
    "apexPMD.rulesetPath": "", // on Mac

    // Will run static analysis every time a file is opened
    "apexPMD.runOnFileOpen": true,

    // Will run static analysis every time a file is saved
    "apexPMD.runOnFileSave": true,

    // Determines at what priority level 'errors' will be added. Anything less will be a warning or hint
    "apexPMD.priorityErrorThreshold": 1,

    // Determines at what priority level 'warnings' will be added. Anything less will be a hint
    "apexPMD.priorityWarnThreshold": 3
```

## Defining your own "Ruleset"

I recommend you use the [default ruleset](https://github.com/ChuckJonas/vscode-apex-pmd/blob/master/rulesets/apex_ruleset.xml) as a starting point.
This ruleset has been updated for PMD >= 6.0

Set `"apexPMD.useDefaultRuleset": false` and update `apexPMD.rulesetPath` to reference your custom ruleset.

[Apex Ruleset Reference](http://pmd.sourceforge.net/snapshot/pmd-apex/rules/index.html#Default_ruleset_used_by_the_CodeClimate_Engine_for_Salesforce.com_Apex)
