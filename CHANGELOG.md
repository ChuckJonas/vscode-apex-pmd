# Changelog

All notable changes to the VS Code Apex PMD will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Bump PMD from 7.14.0 to 7.15.0 by @adangel in [#346](https://github.com/ChuckJonas/vscode-apex-pmd/pull/346)
### Changed
### Deprecated
### Removed
### Fixed
### New Contributors

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.9.0...HEAD

## [0.9.0] - 2025-06-09

### Added

- Support for environment variable PMD_APEX_ROOT_DIRECTORY by @gparada in [#157](https://github.com/ChuckJonas/vscode-apex-pmd/issues/157)
  and by @adangel in [#180](https://github.com/ChuckJonas/vscode-apex-pmd/pull/180)
- New configuration property "apexPMD.apexRootDirectory"
- Updated PMD from 7.6.0 to 7.14.0 by @adangel in [#322](https://github.com/ChuckJonas/vscode-apex-pmd/pull/322)

### Changed

- Configuration properties are organized now in 4 sections. The names of the properties stay the same. The sections
  are:
  * Events
  * Rule Configurations
  * Violation Handling
  * PMD Execution

<details>
  <summary>75 dependency updates</summary>

- Bump tslint from 5.20.1 to 6.1.3 by @dependabot[bot] in [#183](https://github.com/pmd/pmd/pull/183)
- Bump @<!-- -->types/glob from 7.2.0 to 8.1.0 by @dependabot[bot] in [#184](https://github.com/pmd/pmd/pull/184)
- Bump webpack from 5.94.0 to 5.97.1 by @dependabot[bot] in [#193](https://github.com/pmd/pmd/pull/193)
- Bump @<!-- -->types/node from 10.17.60 to 22.10.10 by @dependabot[bot] in [#210](https://github.com/pmd/pmd/pull/210)
- Bump typescript from 3.8.3 to 5.7.3 by @adangel in [#211](https://github.com/pmd/pmd/pull/211)
- Bump eslint and prettier by @adangel in [#212](https://github.com/pmd/pmd/pull/212)
- Bump ts-loader from 8.4.0 to 9.5.2 by @dependabot[bot] in [#213](https://github.com/pmd/pmd/pull/213)
- Bump mocha from 10.2.0 to 11.1.0 by @dependabot[bot] in [#216](https://github.com/pmd/pmd/pull/216)
- Bump @<!-- -->vscode/test-electron from 2.3.9 to 2.4.1 by @dependabot[bot] in [#217](https://github.com/pmd/pmd/pull/217)
- Bump @<!-- -->types/mocha from 10.0.1 to 10.0.10 by @dependabot[bot] in [#218](https://github.com/pmd/pmd/pull/218)
- Bump webpack-cli from 5.1.4 to 6.0.1 by @dependabot[bot] in [#219](https://github.com/pmd/pmd/pull/219)
- Bump @<!-- -->typescript-eslint/eslint-plugin from 8.21.0 to 8.22.0 by @dependabot[bot] in [#220](https://github.com/pmd/pmd/pull/220)
- Bump @<!-- -->typescript-eslint/parser from 8.21.0 to 8.22.0 by @dependabot[bot] in [#221](https://github.com/pmd/pmd/pull/221)
- Bump @<!-- -->types/node from 22.10.10 to 22.12.0 by @dependabot[bot] in [#222](https://github.com/pmd/pmd/pull/222)
- Bump typescript-eslint from 8.21.0 to 8.22.0 by @dependabot[bot] in [#223](https://github.com/pmd/pmd/pull/223)
- Bump @<!-- -->types/node from 22.12.0 to 22.13.0 by @dependabot[bot] in [#224](https://github.com/pmd/pmd/pull/224)
- Bump typescript-eslint from 8.22.0 to 8.23.0 by @dependabot[bot] in [#225](https://github.com/pmd/pmd/pull/225)
- Bump @<!-- -->types/node from 22.13.0 to 22.13.1 by @dependabot[bot] in [#226](https://github.com/pmd/pmd/pull/226)
- Bump eslint from 9.19.0 to 9.20.0 by @dependabot[bot] in [#228](https://github.com/pmd/pmd/pull/228)
- Bump prettier from 3.4.2 to 3.5.0 by @dependabot[bot] in [#230](https://github.com/pmd/pmd/pull/230)
- Bump @<!-- -->typescript-eslint/eslint-plugin from 8.23.0 to 8.24.0 by @dependabot[bot] in [#231](https://github.com/pmd/pmd/pull/231)
- Bump @<!-- -->typescript-eslint/parser from 8.23.0 to 8.24.0 by @dependabot[bot] in [#232](https://github.com/pmd/pmd/pull/232)
- Bump typescript-eslint from 8.23.0 to 8.24.0 by @dependabot[bot] in [#233](https://github.com/pmd/pmd/pull/233)
- Bump eslint from 9.20.0 to 9.20.1 by @dependabot[bot] in [#234](https://github.com/pmd/pmd/pull/234)
- Bump @<!-- -->types/node from 22.13.1 to 22.13.2 by @dependabot[bot] in [#235](https://github.com/pmd/pmd/pull/235)
- Bump @<!-- -->types/node from 22.13.2 to 22.13.4 by @dependabot[bot] in [#236](https://github.com/pmd/pmd/pull/236)
- Bump prettier from 3.5.0 to 3.5.1 by @dependabot[bot] in [#237](https://github.com/pmd/pmd/pull/237)
- Bump webpack from 5.97.1 to 5.98.0 by @dependabot[bot] in [#238](https://github.com/pmd/pmd/pull/238)
- Bump @<!-- -->typescript-eslint/parser from 8.24.0 to 8.24.1 by @dependabot[bot] in [#239](https://github.com/pmd/pmd/pull/239)
- Bump typescript-eslint from 8.24.0 to 8.25.0 by @dependabot[bot] in [#242](https://github.com/pmd/pmd/pull/242)
- Bump prettier from 3.5.1 to 3.5.2 by @dependabot[bot] in [#244](https://github.com/pmd/pmd/pull/244)
- Bump eslint from 9.20.1 to 9.21.0 by @dependabot[bot] in [#245](https://github.com/pmd/pmd/pull/245)
- Bump @<!-- -->types/node from 22.13.4 to 22.13.5 by @dependabot[bot] in [#247](https://github.com/pmd/pmd/pull/247)
- Bump eslint-config-prettier from 10.0.1 to 10.0.2 by @dependabot[bot] in [#248](https://github.com/pmd/pmd/pull/248)
- Bump @<!-- -->types/node from 22.13.5 to 22.13.8 by @dependabot[bot] in [#250](https://github.com/pmd/pmd/pull/250)
- Bump prettier from 3.5.2 to 3.5.3 by @dependabot[bot] in [#251](https://github.com/pmd/pmd/pull/251)
- Bump @<!-- -->typescript-eslint/eslint-plugin from 8.25.0 to 8.26.0 by @dependabot[bot] in [#252](https://github.com/pmd/pmd/pull/252)
- Bump typescript-eslint from 8.25.0 to 8.26.0 by @dependabot[bot] in [#253](https://github.com/pmd/pmd/pull/253)
- Bump typescript from 5.7.3 to 5.8.2 by @dependabot[bot] in [#254](https://github.com/pmd/pmd/pull/254)
- Bump @<!-- -->types/node from 22.13.8 to 22.13.9 by @dependabot[bot] in [#255](https://github.com/pmd/pmd/pull/255)
- Bump eslint-config-prettier from 10.0.2 to 10.1.1 by @dependabot[bot] in [#256](https://github.com/pmd/pmd/pull/256)
- Bump eslint from 9.21.0 to 9.22.0 by @dependabot[bot] in [#257](https://github.com/pmd/pmd/pull/257)
- Bump @<!-- -->types/node from 22.13.9 to 22.13.10 by @dependabot[bot] in [#258](https://github.com/pmd/pmd/pull/258)
- Bump typescript-eslint from 8.26.0 to 8.26.1 by @dependabot[bot] in [#260](https://github.com/pmd/pmd/pull/260)
- Bump typescript-eslint from 8.26.1 to 8.27.0 by @dependabot[bot] in [#265](https://github.com/pmd/pmd/pull/265)
- Bump @<!-- -->types/node from 22.13.10 to 22.13.11 by @dependabot[bot] in [#266](https://github.com/pmd/pmd/pull/266)
- Bump eslint from 9.22.0 to 9.23.0 by @dependabot[bot] in [#268](https://github.com/pmd/pmd/pull/268)
- Bump @<!-- -->types/node from 22.13.11 to 22.13.13 by @dependabot[bot] in [#269](https://github.com/pmd/pmd/pull/269)
- Bump eslint-plugin-prettier from 5.2.3 to 5.2.5 by @dependabot[bot] in [#270](https://github.com/pmd/pmd/pull/270)
- Bump typescript-eslint from 8.27.0 to 8.28.0 by @dependabot[bot] in [#271](https://github.com/pmd/pmd/pull/271)
- Bump @<!-- -->types/node from 22.13.13 to 22.13.14 by @dependabot[bot] in [#273](https://github.com/pmd/pmd/pull/273)
- Bump @<!-- -->types/node from 22.13.14 to 22.13.16 by @dependabot[bot] in [#275](https://github.com/pmd/pmd/pull/275)
- Bump typescript-eslint from 8.28.0 to 8.29.0 by @dependabot[bot] in [#276](https://github.com/pmd/pmd/pull/276)
- Bump @<!-- -->types/node from 22.13.16 to 22.13.17 by @dependabot[bot] in [#277](https://github.com/pmd/pmd/pull/277)
- Bump @<!-- -->types/node from 22.13.17 to 22.14.0 by @dependabot[bot] in [#278](https://github.com/pmd/pmd/pull/278)
- Bump eslint-plugin-prettier from 5.2.5 to 5.2.6 by @dependabot[bot] in [#279](https://github.com/pmd/pmd/pull/279)
- Bump eslint from 9.23.0 to 9.24.0 by @dependabot[bot] in [#282](https://github.com/pmd/pmd/pull/282)
- Bump typescript from 5.8.2 to 5.8.3 by @dependabot[bot] in [#283](https://github.com/pmd/pmd/pull/283)
- Bump @<!-- -->typescript-eslint/eslint-plugin from 8.29.0 to 8.29.1 by @dependabot[bot] in [#285](https://github.com/pmd/pmd/pull/285)
- Bump webpack from 5.98.0 to 5.99.5 by @dependabot[bot] in [#287](https://github.com/pmd/pmd/pull/287)
- Bump eslint-config-prettier from 10.1.1 to 10.1.2 by @dependabot[bot] in [#288](https://github.com/pmd/pmd/pull/288)
- Bump typescript-eslint from 8.29.0 to 8.31.0 by @dependabot[bot] in [#293](https://github.com/pmd/pmd/pull/293)
- Bump @<!-- -->eslint/js from 9.24.0 to 9.27.0 by @dependabot[bot] in [#308](https://github.com/pmd/pmd/pull/308)
- Bump webpack from 5.99.5 to 5.99.9 by @dependabot[bot] in [#309](https://github.com/pmd/pmd/pull/309)
- Bump @<!-- -->types/node from 22.14.0 to 22.15.23 by @dependabot[bot] in [#311](https://github.com/pmd/pmd/pull/311)
- Bump mocha from 11.1.0 to 11.5.0 by @dependabot[bot] in [#312](https://github.com/pmd/pmd/pull/312)
- Bump eslint-config-prettier from 10.1.2 to 10.1.5 by @dependabot[bot] in [#313](https://github.com/pmd/pmd/pull/313)
- Bump @<!-- -->types/node from 22.15.23 to 22.15.24 by @dependabot[bot] in [#314](https://github.com/pmd/pmd/pull/314)
- Bump @<!-- -->vscode/test-electron from 2.4.1 to 2.5.2 by @dependabot[bot] in [#315](https://github.com/pmd/pmd/pull/315)
- Bump typescript-eslint from 8.31.0 to 8.33.0 by @dependabot[bot] in [#316](https://github.com/pmd/pmd/pull/316)
- Bump @<!-- -->types/node from 22.15.24 to 22.15.27 by @dependabot[bot] in [#317](https://github.com/pmd/pmd/pull/317)
- Bump @<!-- -->eslint/js from 9.27.0 to 9.28.0 by @dependabot[bot] in [#319](https://github.com/pmd/pmd/pull/319)
- Bump eslint from 9.24.0 to 9.28.0 by @dependabot[bot] in [#320](https://github.com/pmd/pmd/pull/320)
- Bump @<!-- -->types/node from 22.15.27 to 22.15.30 by @dependabot[bot] in [#321](https://github.com/pmd/pmd/pull/321)
- Bump PMD from 7.6.0 to 7.14.0 by @adangel in [#322](https://github.com/ChuckJonas/vscode-apex-pmd/pull/322)

</details>

### Fixed

- PMD fails to run from within VS Code when workspace path contains special characters  
  Reported by @mlankfer in [#181](https://github.com/ChuckJonas/vscode-apex-pmd/issues/181)  
  Fixed by @adangel in [#187](https://github.com/ChuckJonas/vscode-apex-pmd/pull/187)

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.8.0...v0.9.0

## [0.8.0] - 2024-09-27

### Added

- Upgrade PMD from 7.0.0 to 7.6.0 by @adangel in [#176](https://github.com/ChuckJonas/vscode-apex-pmd/pull/176)

### Changed

- Bump braces from 3.0.2 to 3.0.3 by @dependabot in [#168](https://github.com/ChuckJonas/vscode-apex-pmd/pull/168)
- Bump webpack from 5.88.2 to 5.94.0 by @dependabot in [#172](https://github.com/ChuckJonas/vscode-apex-pmd/pull/172)
- Improve PMD update procedure by @adangel in [#174](https://github.com/ChuckJonas/vscode-apex-pmd/pull/174)
- Bump micromatch from 4.0.5 to 4.0.8 by @adangel in [#175](https://github.com/ChuckJonas/vscode-apex-pmd/pull/175)

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.7.0...v0.8.0

## [0.7.0] - 2024-04-25

### Added

- Upgrade to PMD 7.0.0 [#159](https://github.com/ChuckJonas/vscode-apex-pmd/issues/159)

### Changed

- Upgrade bundled PMD version to 7.0.0 by @adangel in [#160](https://github.com/ChuckJonas/vscode-apex-pmd/pull/160)
- Upgraded github actions and node by @adangel in [#161](https://github.com/ChuckJonas/vscode-apex-pmd/pull/161)

### Fixed

- Default ruleset not compatible with final PMD 7.0.0 [#158](https://github.com/ChuckJonas/vscode-apex-pmd/issues/158)

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.6.2...v0.7.0

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

- @surfmuggle made their first contribution in https://github.com/ChuckJonas/vscode-apex-pmd/pull/137

**Full Changelog**: https://github.com/ChuckJonas/vscode-apex-pmd/compare/v0.6.0...v0.6.1

## [0.6.0] - 2023-08-24

### Added

- Add github actions workflow [#132](https://github.com/ChuckJonas/vscode-apex-pmd/pull/132) @adangel

### Changed

- Upgraded to PMD7! (7.0.0-rc3)

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
- Added \*.apxc to file extensions

### Changed

- Replaced deprecated ref-values in rule-tags
- Fix: Added check to avoid "TypeError: Cannot read property 'substr' of undefined"
- Fix: Added clearing in problems tab in case there are no detected problems anymore
