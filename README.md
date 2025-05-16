# UnitTest Toggler

This extension allows you to easily toggle between module files and unittest files in VS Code.
VSCode上でモジュールファイルとunittestファイルを簡単に切り替えるための拡張機能です。

## Features / 機能

- Easy switching between module files and test files
- モジュールファイルとテストファイルを簡単に切り替え

- Automatic generation of non-existent test files
- 存在しないテストファイルを自動生成

- Batch generation of test files for multiple source files
- 複数ファイルのテストファイルを一括生成

- Support for various programming languages
- 各種プログラミング言語に対応

- Customizable settings to match your project structure
- プロジェクト構成に合わせた設定が可能

## How to Use / 使用方法

### Toggle Between Module and Test Files / モジュールとテストファイルの切り替え

1. Open a module file (e.g., `sample.py`)
   モジュールファイル（例: `hoge.py`）を開きます

2. Execute the command using one of these methods:
   以下のいずれかの方法でコマンドを実行します：
   - Shortcut key: `Ctrl+Shift+T` (on macOS: `Cmd+Shift+T`)
     ショートカットキー: `Ctrl+Shift+T` (macOSでは `Cmd+Shift+T`)
   - Command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`): Run "Toggle UnitTest"
     コマンドパレット (`Ctrl+Shift+P` または `Cmd+Shift+P`) から「Toggle UnitTest」を実行
   - Right-click in the editor and select "Toggle UnitTest"
     エディタ上で右クリックして「Toggle UnitTest」を選択

3. The corresponding test file (e.g., `test_sample.py`) will open
   対応するテストファイル（例: `test_hoge.py`）が開きます
   - If the test file doesn't exist, it will be automatically generated
     テストファイルが存在しない場合は自動で生成されます

### Batch Generate Test Files / テストファイルの一括生成

1. Select one or multiple files in the File Explorer
   ファイルエクスプローラーで単一または複数のファイルを選択します

2. Right-click and select "Generate UnitTest"
   右クリックして「Generate UnitTest」を選択します

3. Test files will be generated for all selected files
   選択したすべてのファイルに対応するテストファイルが生成されます

## Extension Settings / 拡張機能の設定

You can modify the following settings in your User or Workspace settings:
以下の設定をユーザー設定またはワークスペース設定で変更できます：

* `unittestToggler.sourceDirectory`: Name of your project's source code directory (default: `src`)
  プロジェクトのソースコードディレクトリ名（デフォルト: `src`）

* `unittestToggler.testDirectory`: Name of your project's test code directory (default: `tests`)
  プロジェクトのテストコードディレクトリ名（デフォルト: `tests`）

* `unittestToggler.testFileAffix`: Prefix or suffix added to test file names (default: `test_`)
  テストファイル名に追加される接頭辞または接尾辞（デフォルト: `test_`）

* `unittestToggler.isPrefix`: Whether to use the affix as a prefix (default: `true`)
  テストファイルの付加文字列を接頭辞として使用するかどうか（デフォルト: `true`）
  - `true`: Format like `test_sample.py` / `test_hoge.py`のような形式
  - `false`: Format like `sample_test.py` / `hoge_test.py`のような形式

## Setting Examples / 設定例

You can add settings like the following to your `settings.json`:
`settings.json` に以下のような設定を追加できます：

```json
{
  "unittestToggler.sourceDirectory": "app",
  "unittestToggler.testDirectory": "spec",
  "unittestToggler.testFileAffix": "_spec",
  "unittestToggler.isPrefix": false
}
```

With these settings: / この設定では：
- Source file: `app/module/user.js` / ソースファイル: `app/module/user.js`
- Test file: `spec/module/user_spec.js` / テストファイル: `spec/module/user_spec.js`

## Requirements / 動作環境

- Visual Studio Code version 1.100.0 or later
- Visual Studio Code バージョン 1.100.0 以降

## Release Notes / リリースノート

### 0.0.1

- Initial release / 初回リリース
- Module and test file toggle feature / モジュールとテストファイルの切り替え機能
- Test file auto-generation feature / テストファイル自動生成機能
- Batch file generation feature / 複数ファイル一括生成機能
- Settings customization feature / 設定カスタマイズ機能

## License / ライセンス

MIT

**Enjoy!**
