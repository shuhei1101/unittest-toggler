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
2. `unittestToggler.sourceDirectory`: Absolute path to your project's source code directory (e.g. `/path/to/project/src/main`)
3. `unittestToggler.testDirectory`: Absolute path to your project's test code directory (e.g. `/path/to/project/src/test`)
4. `unittestToggler.testFileAffix`: Prefix or suffix added to test file names (default: `test_`)

#### new (^1.0.1~)
- <img src='https://raw.githubusercontent.com/shuhei1101/unittest-toggler/main/images/20250517232814.png' width='100%'>
- `anotherGroup`: Open files in another editor group if available, or create a new group (default)
- `currentGroup`: Open files in the current editor group (previously called "activeGroup")

### settings.json
You can add settings like the following to your `settings.json`:

#### Python Project Example
```json
{
  "unittestToggler.sourceDirectory": "/path/to/your/project/src",
  "unittestToggler.testDirectory": "/path/to/your/project/tests",
  "unittestToggler.testFileAffix": "test_",
  "unittestToggler.isPrefix": true
}
```
- Source file: `/path/to/your/project/src/hoge/huga.py`
- Test file: `/path/to/your/project/tests/hoge/test_huga.py`

#### Java Project Example
```json
{
  "unittestToggler.sourceDirectory": "/path/to/your/project/src/main/java",
  "unittestToggler.testDirectory": "/path/to/your/project/src/test/java",
  "unittestToggler.testFileAffix": "Test",
  "unittestToggler.isPrefix": false
}
```
- Source file: `/path/to/your/project/src/main/java/com/example/Sample.java`
- Test file: `/path/to/your/project/src/test/java/com/example/SampleTest.java`

## Requirements

- Visual Studio Code version 1.100.0 or later

ustomization feature

## License

MIT

**Enjoy TDD!**
