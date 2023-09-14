# project2 - with space

The tests uses this folder as `workspaceRootPath` - and the folder name contains spaces. This might need
to be quoted, depending on the operating system.

This tests issue [#139](https://github.com/ChuckJonas/vscode-apex-pmd/issues/139)

Additionally, this folder contains the symlink `pmd-symlink`, which points to the pmd installation
inside this repo (`../../../bin/pmd`). In the test, `pmdBinPath` can be set to this symlink. Since
it is in this project folder which contains spaces, we can test paths with spaces. By default, `pmdBinPath`
is resolved against the extension installation folder, which is in the user homedir, which could contain
spaces in the name.

This tests issue [#146](https://github.com/ChuckJonas/vscode-apex-pmd/issues/146).
