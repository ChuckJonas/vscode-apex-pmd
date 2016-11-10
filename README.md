# apex-pmd

This extension allows you to run [Apex Static Anaylsis](http://pmd.sourceforge.net/snapshot/pmd-apex/) directly in vscode.

## Features

### Current actions Supported

* Run Anaylsis on entire workspace
* Run Anaylsis on single file

**TODO**

* Run Anaylsis on save/open

## Installation

1. Must have `JDK >=1.4` installed and in path
2. Install `PMD >= 5.6` "bin" release from [here](https://sourceforge.net/projects/pmd/files/pmd/)
3. unzip to location of choice
4. In VScode, Open `User Preferences` and set `apexPMD.pmdPath` folder where pmd was installed in step 3 (should contain `run.sh`):

``` javascript
 "apexPMD.pmdPath": "/Users/jonas/pmd"
```

## Extension Settings

**TODO**

* Add ability to specify which rules to run
* Ability to specify if Anaylsis should run on file open/save
