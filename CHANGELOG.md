# Change Log

All notable changes to the "unittest-toggler" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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