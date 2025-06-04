# Change Log

All notable changes to the "unittest-toggler" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.2.0] - 2025-06-05

### Breaking Changes
- **BREAKING**: Changed `sourceDirectory` and `testDirectory` settings to use absolute paths instead of relative paths
  - Previously: `"unittestToggler.sourceDirectory": "src"`
  - Now: `"unittestToggler.sourceDirectory": "/absolute/path/to/your/project/src"`
  - This change enables better support for complex project structures, especially Java projects with `src/main` and `src/test` directories

### Added
- Enhanced support for Java project structures (e.g., `src/main/java` and `src/test/java`)
- Better error handling when source or test directories are not configured
- Updated README.md with new configuration examples for Python and Java projects

### Changed
- Improved path resolution logic to use absolute paths throughout the codebase
- Removed dependency on workspace-relative path calculations
- Updated default values for directory settings to empty strings (requiring explicit configuration)

## [1.1.2] - 2025-05-18

### Fixed
- Bug fix: Fixed an issue where new groups would be created even if there were already other editor groups.
- Improved editor group detection logic and corrected `ViewColumn.Active` handling

## [1.1.1]- 2025-05-18
- Updated README.md

## [1.1.0] - 2025-05-17

### Added
- New `openLocation` setting to control editor group placement when toggling files
  - `currentGroup`: Open in the current editor group
  - `anotherGroup`: Open in another editor group if available (default setting)
- Toggle UnitTest command to editor tab context menus for easier access

### Changed
- Renamed setting options for better clarity:
  - `activeGroup` → `currentGroup`
  - `otherGroup` → `anotherGroup`
- Improved editor group handling when switching between files already open in different editor groups

### Removed
- Simplified UI by removing the Generate UnitTest command (functionality still available via Toggle UnitTest)

## [1.0.1] - 2025-05-16

### Fixed
- Improved behavior in multi-workspace environments (correctly identifying the workspace to which the current file belongs)

## [1.0.0] - 2025-05-15

### Added
- Initial release
- Module and test file toggle feature
- Test file auto-generation feature
- Batch file generation feature
- Settings customization feature