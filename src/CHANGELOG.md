# Change Log
All notable changes to the "Apex PMD" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2018-3-20
### Added
- Ability to set a relative path to ruleset. You can now commit a ruleset to your repo.
- Debug ouput control. You can now change the detail level of the debug output: use `showErrors`, `showStdErr`, `showStdOut` settings
- Added *.apxc to file extensions

### Changed
- Replaced deprecated ref-values in rule-tags
- Fix: Added check to avoid "TypeError: Cannot read property 'substr' of undefined"
- Fix: Added clearing in problems tab in case there are no detected problems anymore