# UnitTest Toggler

This extension allows you to easily toggle between module files and unittest files in VS Code. \
(VSCode上でモジュールファイルとunittestファイルを簡単に切り替えるための拡張機能です。)

## Features / How to Use (機能 / 使い方)

### (new) Open files in the another editor group
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/cfg-another-group.gif' width='100%'>
-  Select `anotherGroup` on new setting `openLocation` 

### Easy switching between module files and test files
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/module_to_ut.gif' width='100%'>
- Press `Ctrl+Shift+T` (macOS: `Cmd+Shift+T`)
- Command-palette to `Toggle UnitTest`
- Right-click to `Toggle UnitTest`

### Automatic generation of non-existent test files
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/new_ut_trim.gif' width='100%'>
- If test-file does not exist, create it!
- If module-file does not exist, create it!
- If folder does not exist, create it!

### Batch generation of test files for multiple source files
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/multiple_source.gif' width='100%'>
- Support for various programming languages

### Customizable settings to match your project structure
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/customizable_settings.gif' width='100%'>

## Setting Examples (設定例)
### vscode settings(Ctrl + ,)
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/20250516211721.png' width='100%'>
1. `unittestToggler.isPrefix`: Whether to use the affix as a prefix (default: `true`)
   - `true`: Format like `test_sample.py`
   - `false`: Format like `sample_test.py`
2. `unittestToggler.sourceDirectory`: Name of your project's source code directory (default: `src`)
3. `unittestToggler.testDirectory`: Name of your project's test code directory (default: `tests`)
4. `unittestToggler.testFileAffix`: Prefix or suffix added to test file names (default: `test_`)

#### new (^1.0.1~)
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/20250517232814.png' width='100%'>
- `anotherGroup`: Open files in another editor group if available, or create a new group (default)
- `currentGroup`: Open files in the current editor group (previously called "activeGroup")

### settings.json
You can add settings like the following to your `settings.json`:

```json
{
  "unittestToggler.sourceDirectory": "src",
  "unittestToggler.testDirectory": "test",
  "unittestToggler.testFileAffix": "_test",
  "unittestToggler.isPrefix": false
}
```
- Source file: `src/hoge/huga.ts`
- Test file: `test/hoge/huga_test.ts`

## Requirements

- Visual Studio Code version 1.100.0 or later

## Release Notes

### 1.1.0
- Added new setting `openLocation` to control where files are opened when toggling between source and test files
  - `currentGroup`: Open files in the current editor group (previously called "activeGroup")
  - `anotherGroup`: Open files in another editor group if available, or create a new group (default)
- Enhanced context menu support: 
  - Added Toggle UnitTest command to editor tab context menus
  - Simplified UI by removing the Generate UnitTest command (functionality available via Toggle UnitTest)
- Improved editor group handling when toggling between files already open in different groups

### 1.0.1

- Bug-fix: Improved behavior in multi-workspace environments (correctly identifying the workspace to which the current file belongs)

### 1.0.0

- Initial release
- Module and test file toggle feature
- Test file auto-generation feature
- Batch file generation feature
- Settings customization feature

## License

MIT

**Enjoy TDD!**
