# project1

Test project with the following properties:

- uses a custom ruleset with a custom java-based PMD rule: `apex_ruleset.xml`
- this custom java-based PMD rule is stored inside a jar-file which is added to `additionalClassPaths`.

It is expected, that the ruleset can be loaded and executed.

The PMD rule implementation can be found in the folder `custom_rule` including a script to compile and
create a jar file. For convenience, this jar file is also committed directly.

The project contains one apex source file, for which one violation from the custom rule is expected.

This tests issue [#145](https://github.com/ChuckJonas/vscode-apex-pmd/issues/145)
