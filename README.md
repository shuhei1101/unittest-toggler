# UnitTest Toggler

VSCode上でモジュールファイルとunittestファイルを簡単に切り替えるための拡張機能です。ittest-toggler README

This is the README for your extension "unittest-toggler". After writing up a brief description, we recommend including the following sections.

## 機能

- モジュールファイルとテストファイルを簡単に切り替え
- 存在しないテストファイルを自動生成
- 複数ファイルのテストファイルを一括生成
- 各種プログラミング言語に対応
- プロジェクト構成に合わせた設定が可能

## 使用方法

### モジュールとテストファイルの切り替え

1. モジュールファイル（例: `hoge.py`）を開きます
2. 以下のいずれかの方法でコマンドを実行します：
   - ショートカットキー: `Ctrl+Shift+T` (macOSでは `Cmd+Shift+T`)
   - コマンドパレット (`Ctrl+Shift+P` または `Cmd+Shift+P`) から「Toggle UnitTest」を実行
   - エディタ上で右クリックして「Toggle UnitTest」を選択
3. 対応するテストファイル（例: `test_hoge.py`）が開きます
   - テストファイルが存在しない場合は自動で生成されます

### テストファイルの一括生成

1. ファイルエクスプローラーで単一または複数のファイルを選択します
2. 右クリックして「Generate UnitTest」を選択します
3. 選択したすべてのファイルに対応するテストファイルが生成されます

## 拡張機能の設定

以下の設定をユーザー設定またはワークスペース設定で変更できます：

* `unittestToggler.sourceDirectory`: プロジェクトのソースコードディレクトリ名（デフォルト: `src`）
* `unittestToggler.testDirectory`: プロジェクトのテストコードディレクトリ名（デフォルト: `tests`）
* `unittestToggler.testFileAffix`: テストファイル名に追加される接頭辞または接尾辞（デフォルト: `test_`）
* `unittestToggler.isPrefix`: テストファイルの付加文字列を接頭辞として使用するかどうか（デフォルト: `true`）
  - `true`: `test_hoge.py`のような形式
  - `false`: `hoge_test.py`のような形式

## 設定例

```json
{
  "unittestToggler.sourceDirectory": "app",
  "unittestToggler.testDirectory": "spec",
  "unittestToggler.testFileAffix": "_spec",
  "unittestToggler.isPrefix": false
}
```

この設定では：
- ソースファイル: `app/module/user.js`
- テストファイル: `spec/module/user_spec.js`

## 動作環境

- Visual Studio Code バージョン 1.100.0 以降

## リリースノート

### 0.0.1

- 初回リリース
- モジュールとテストファイルの切り替え機能
- テストファイル自動生成機能
- 複数ファイル一括生成機能
- 設定カスタマイズ機能

## ライセンス

MIT

**Enjoy!**
