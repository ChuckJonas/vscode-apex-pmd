# apex-pmd

This extension allows you to run [Apex Static Anaylsis](http://pmd.sourceforge.net/snapshot/pmd-apex/) directly in vscode.

## Features

### Current actions Supported

* Run Anaylsis on entire workspace
* Run Anaylsis on single file

### TODO

* Run Anaylsis on save/open

## Requirements

Must have `java` installed and in path

## Extension Settings

### TODO

* Add ability to specify which rules to run
* Ability to specify if Anaylsis should run on file open/save

## Known Issues

For some reason running pmd from `child_process` seems to be very slow (as compared to running it directly in terminal).
It seems to have something to do with `jvm` initlization.