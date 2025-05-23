# 仕様書

## 目的
VSCode上でモジュールファイルとunittestファイルを簡単に作成・切り替えできるようにすることを目的とする。

## 要件・機能

- VSCode 拡張機能としてリリースできること
- どの言語(拡張子)にも対応すること
- ショートカットキーもしくはCtrl + Shift + Pもしくは、ファイル上右クリックでコマンドの実行ができること
- フォルダもしくはワークスペースのsetting.jsonで現在のプロジェクト構成や、unittestファイルの名称等を登録できること(通常の設定(Ctrl + .)からもGUI上で設定可能なこと)
    - プロジェクトのsrcディレクトリ
    - プロジェクトのtestsディレクトリ
    - unittestファイルの付加文字列
        - 例: 「_test」「tests_」
    - 文字列を接頭につけるかどうか(isPrefix)
        - 例: true, false
        - 説明: trueかつ、付加文字列が「tests_」の場合、検索、作成されるテストコードが「tests_hoge.java」等になること
    - 補足:
        - srcやtestsの名前は任意で構わないこと
- モジュールファイル(hoge.py)上でコマンド「toggle unittest」を実行するとtest_hoge.py(isPrefix==true, テスト付加文字がtest_の場合)ファイルを開くこと
    - このとき、ファイルが存在しない場合は自動で生成すること
        - 経路のフォルダが存在しない場合も、自動で生成すること
    - ファイルを検索するときは、モジュールファイルと同様のフォルダ構成の場所を探しに行くこと
- 逆も可能。テストファイル上で「toggle unittest」を実行すると上記と同様の処理が行われること
- VSCodeのファイルエクスプローラー上でファイルを一件以上選択し、コマンド「generate unittest」を押すと、自動でtestファイルを作成できること
    - 仮に「testsディレクトリ」上で行った場合、モジュールディレクトリが「srcディレクトリ」配下に作成されること
    - 選択したファイルがsetting.jsonに設定した「srcディレクトリ」もしくは「testsディレクトリ」外のファイルが選択されている場合、エラーを表示すること

