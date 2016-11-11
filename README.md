# apex-pmd

This extension allows you to run [Apex Static Anaylsis](http://pmd.sourceforge.net/snapshot/pmd-apex/) directly in vscode.

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
2. Download ["bin" release](https://sourceforge.net/projects/pmd/files/pmd/) (`>= 5.6`)
3. unzip to location of choice
4. In VScode, Open `Preferences: User Settings` and set `apexPMD.pmdPath` to folder where pmd was unzipped in step 3

## Configuration

``` javascript
    // absolute path to where PMD was installed
    "apexPMD.pmdPath": "/Users/johndoe/pmd",

    // Set to false to use you own ruleset (set path)
    "apexPMD.useDefaultRuleset": "true",

    // Absolute path to ruleset xml file.  Must also set `useDefaultRuleset:false`.
    "apexPMD.rulesetPath": "",

    // Will run static analysis every time a file is opened
    "apexPMD.runOnFileOpen": "true",

    // Will run static analysis every time a file is saved
    "apexPMD.runOnFileSave": "true",

    // Determines at what priority level 'errors' will be added. Anything less will be a warning or hint
    "apexPMD.priorityErrorThreshold": "1",

    // Determines at what priority level 'warnings' will be added. Anything less will be a hint
    "apexPMD.priorityWarnThreshold": "3"
```

## Defining your own "Ruleset"

I recommend you use the [default ruleset](https://github.com/ChuckJonas/vscode-apex-pmd/blob/master/rulesets/apex_ruleset.xml) as a starting point.

Set `"apexPMD.useDefaultRuleset": "false"` and update `apexPMD.rulesetPath` to reference your custom ruleset.

[Apex Ruleset Reference](http://pmd.sourceforge.net/snapshot/pmd-apex/rules/index.html#Default_ruleset_used_by_the_CodeClimate_Engine_for_Salesforce.com_Apex)
