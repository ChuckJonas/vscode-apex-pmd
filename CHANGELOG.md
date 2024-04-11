# Changelog
All notable changes to the VS Code Apex PMD will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
### Changed

- default ruleset: Use "visualforce" instead of "vf" by @adangel in [#160](https://github.com/ChuckJonas/vscode-apex-pmd/pull/160)

### Deprecated
### Removed
### Fixed

- Default ruleset not compatible with final PMD 7.0.0 [#158](https://github.com/ChuckJonas/vscode-apex-pmd/issues/158)

### New Contributors

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.6.2...HEAD

## [0.6.2] - 2023-09-14

### Added

- [ci] Run github actions and tests on all operating systems by @adangel in [#150](https://github.com/ChuckJonas/vscode-apex-pmd/pull/150)

### Changed

- Improve marketplace integration - Rename CHANGELOG -> CHANGELOG.md by @adangel in [#147](https://github.com/ChuckJonas/vscode-apex-pmd/pull/147)
- Bump @vscode/test-electron from 1.6.1 to 2.3.4 by @adangel in [#149](https://github.com/ChuckJonas/vscode-apex-pmd/pull/149)
- CLASSPATH must only be quoted for Windows by @adangel in [#151](https://github.com/ChuckJonas/vscode-apex-pmd/pull/151)
- Quote pmdBinPath in case it contains spaces by @adangel in [#152](https://github.com/ChuckJonas/vscode-apex-pmd/pull/152)

### Fixed

- additionalClassPaths not being picked up for custom rules (regression in 0.6.1) [#145](https://github.com/ChuckJonas/vscode-apex-pmd/issues/145)
- Cannot execute PMD when user dir contains spaces [#146](https://github.com/ChuckJonas/vscode-apex-pmd/issues/146)

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.6.1...v0.6.2

## [0.6.1] - 2023-09-08

### Added

- Check for "Cannot load ruleset" by @adangel in [#141](https://github.com/ChuckJonas/vscode-apex-pmd/pull/141)

### Changed

- Update README.md - Intro sentence to get the command palette opened by @surfmuggle in [#137](https://github.com/ChuckJonas/vscode-apex-pmd/pull/137)
- Update dependencies by @adangel in [#142](https://github.com/ChuckJonas/vscode-apex-pmd/pull/142)
- Quote classPath to deal with spaces in workspaceRootPath by @adangel in [#143](https://github.com/ChuckJonas/vscode-apex-pmd/pull/143)

### Removed

- remove settings `showErrors`, `showStdOut`, and `showStdErr`. Output from PMD execution is always
  displayed in the output window. This helps to diagnose problems like ruleset loading errors.

### Fixed

- Error executing PMD when project folder uses spaces [#139](https://github.com/ChuckJonas/vscode-apex-pmd/issues/139)
- Static Analysis Failed - Cannot load ruleset [#140](https://github.com/ChuckJonas/vscode-apex-pmd/issues/140)

### New Contributors

* @surfmuggle made their first contribution in https://github.com/ChuckJonas/vscode-apex-pmd/pull/137

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.6.0...v0.6.1

## [0.6.0] - 2023-08-24

### Added

- Add github actions workflow [#132](https://github.com/ChuckJonas/vscode-apex-pmd/pull/132) @adangel

### Changed

- Upgraded to PMD7!

### Removed

- WARNING: PMD6 is no longer supported via `pmdBinPath` setting. If you receive an error, please clear this setting!

## [0.5.9] - 2022-02-26

### Changed

- added ability to run on `xml` files [#101](https://github.com/ChuckJonas/vscode-apex-pmd/pull/101) @nawforce
- upgraded PMD to 6.42.0

## [0.5.8] - 2021-12-21

### Changed

- Added support for custom JRE path

## [0.5.7] - 2021-12-21

## [0.5.6] - 2021-08-27

## [0.5.5] - 2021-08-27

## [0.5.4] - 2021-08-27

### Changed

- Upgraded PMD to 6.37.0 [#93](https://github.com/ChuckJonas/vscode-apex-pmd/pull/93) @PawelWozniak

## [0.5.3]

### Changed

- upgraded PMD to 6.32.0

## [0.5.2]

### Changed

- bundled the extension
- upgraded PMD to 6.27.0

## [0.5.1]

### Changed

- upgraded PMD to 6.26.0 [#78](https://github.com/ChuckJonas/vscode-apex-pmd/pull/78) @Raspikabek

## [0.5.0]

### Added
- Ability to run PMD on file change

### Change
- Long overdue refactors to simplify code
- Removed unneeded pmd dist files (reduced package size by 80%!)

## [0.4.10]
### Change
- upgraded to PMD 6.23

## [0.4.9]
### Change
- upgraded to PMD 6.22
- added Cognitive Complexity to default rule-set
- removed Cyclomatic Complexity from default rule-set
- fixed stale readme link
- Upgraded vscode engine to 1.43.0 (min vscode version) + Upgraded to new test "framework"

## [0.4.8]
### Change
- npm audit fix
- fixing bad documentation links

## [0.4.7]
### Change
- fix issue with `cachePath` not working for windows
- upgraded PMD to 6.21.0

## [0.4.6]
### Change
- fix issue with `pmdBinPath` not working for relative url

## [0.4.5]
### Added
- Link to Rule documentation
- Ruleset-Rulename in description

### Change
- showStdErr now defaults to true
- updated to [PMD 6.17.0](https://github.com/pmd/pmd/releases/tag/pmd_releases%2F6.17.0)

## [0.4.4]
### Change
- New Logo
- Removed clear diagnostics onDocumentClose
- Fixed tests

## [0.4.3]
### Change
- Fixed issue with maxBuffer only partial run on very large projects

## [0.4.2]
### Change
- Diagnostic Severity for issues < `priorityWarnThreshold` from `hint` to `information`
- Upgraded PMD bin to [6.13.0](https://pmd.github.io/pmd-6.13.0/pmd_release_notes.html)
- Updated default ruleset with new rules

### Added
- Ability to specify additional class paths to run custom rule jars (thanks @andrewgilbertsagecom)
- Can specify custom XPath rules (via 6.13.0)

## [0.4.1]
### Change
- corrected version in changelog

## [0.4.0]
### Added
- Ability to enable PMD caching for a faster analysis
### Change
- Upgraded csv parsing package
- Improved recovery handling of bad csv data
- Ignore problems in .sfdx generated files
- Settings auto-load on change. If you change settings you no longer need to reload VSCode


## [0.3.1]
### Change
- Upgrade package to fix security issues

## [0.3.0]
### Added
- New setting `apexPMD.rulesets`. This is a replacement for the deprecated `apexPMD.rulesetPath` setting. You can specify a list of rulesets you need to analyze your code against.
### Removed
- `apexPMD.rulesetPath` setting is now deprecated. It still works for backward compatibility but consider moving to a newer setting `apexPMD.rulesets`.
### Changed
- `apexPMD.pmdBinPath` description is updated to reduce confusion over this setting.


## [0.2.0] - 2018-9-18
### Added

- Added support for visualforce
- Extension now includes PMD binaries by default
- Progress UI for run on workspace with ability to cancel
- Ability to clear all "problems"
- Test Coverage
- Status Bar

### Changed

- Fixed bug with `runOnSave` & `runOnOpen` being switched
- Fixed bug with `runOnOpen` causing pmd to run twice
- Fixed bug with csv escaping
- renamed `pmdPath` setting to `pmdBinPath`
- Updated default ruleset to latest
- Removed `Show Apex PMD Output` as vscode natively supports switching channels
- removed `use default ruleset` setting in favor be just looking for a empty ruleset config
- Cleaned up output and updated setting defaults
- Refactored code and added simple test coverage

## [0.1.0] - 2018-3-20
### Added
- Ability to set a relative path to ruleset. You can now commit a ruleset to your repo.
- Debug ouput control. You can now change the detail level of the debug output: use `showErrors`, `showStdErr`, `showStdOut` settings
- Added *.apxc to file extensions

### Changed
- Replaced deprecated ref-values in rule-tags
- Fix: Added check to avoid "TypeError: Cannot read property 'substr' of undefined"
- Fix: Added clearing in problems tab in case there are no detected problems anymore
