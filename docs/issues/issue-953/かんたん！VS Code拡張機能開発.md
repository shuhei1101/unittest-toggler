
## 手順概要

VS Code拡張機能を開発する手順は以下のようになります。

1.  プロジェクト作成（yoコマンドで1発）
2.  コマンド内容を実装（JS/TSで処理を記述）
3.  コマンドの呼び出され方を定義（package.jsonを編集）
4.  動作確認（VS Codeのデバッガーを使用）
5.  VS Codeで拡張機能として利用可能にする（vsixファイルに変換してインポート）

なお、ここで紹介するのは自分で開発して自分で使うExtensionを作る想定の手順です。マーケットプレイスへの公開手順は紹介しません。（ただし公開手順も難しくはないようです）

## 手順

### 1\. プロジェクト作成

プロジェクトの作成は[Yeoman（yo）](https://www.npmjs.com/package/yo)を使用するのが一番簡単です。Yeomanでは予め用意した雛形に則ってプロジェクト初期化を行えるモジュールです。

まず[generator-code](https://www.npmjs.com/package/generator-code)をグローバルインストールします。これをYoemanで使用するとVS Code拡張のプロジェクトの雛形を生成できます。

```
$ npm install -g generator-code
```

`yo code`を実行すると、`generator-code`を使用してVS Code拡張のプロジェクト作成が開始されます。変なおじさんが出てきていくつか項目の指定を求められます。

```
$ npx yo code

     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to the Visual  │
    |--(o)--|    │   Studio Code Extension  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What type of extension do you want to create? New Extension (TypeScript) 
? What's the name of your extension? vs-devio-opener
? What's the identifier of your extension? vs-devio-opener
? What's the description of your extension? 
? Initialize a git repository? Yes
? Bundle the source code with webpack? Yes
? Which package manager to use? npm
```

項目の指定は上から、

-   コマンドをJavaScript/TypeScriptのいずれで開発するかの選択
-   Extension名の指定
-   ExtensionIDの指定（Extension名と同じでもOK）
-   Extensionの説明（必須ではない）
-   Git Initするかどうか
-   Webpackを使うかどうか（モジュールのバンドリングをするならYes）
-   パッケージマネージャーの選択（npm/npmp/yarn）

という内容です。

実行を完了すると、指定したエクステンション名（`vs-devio-opener`）のプロジェクトディレクトリが作成できました。 ![](https://www.evernote.com/l/APcsRNNugydJ-ImxyHCo8b-Qz8DTt9X8aZwB/image.png)

### 2\. コマンド内容を実装

VS Code拡張の実体は**Commands（コマンド）**です。（Command Paletteから実行できるあれです。）

コマンドの処理内容は`extension.ts`で記述します。既定で作成されるファイル内容は下記になります。

```
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vs-devio-opener" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'vs-devio-opener.helloWorld',
    () =&gt; {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World from vs-devio-opener!');
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
```

上記を必要最低限な記述にするとこうなります。

```
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand(
    'vs-devio-opener.helloWorld',
    () =&gt; {
      vscode.window.showInformationMessage('Hello World from vs-devio-opener!');
    }
  );

  context.subscriptions.push(disposable);
}
```

`vscode.window.showInformationMessage()`でメッセージ表示をする処理を、`vscode.commands.registerCommand`で登録しています。この[コマンドの登録処理](https://code.visualstudio.com/api/extension-guides/command#registering-a-command)は必須となります。

これら`vscode.XXXX.hogehoge`は**VS Code API**の一種で、一覧は下記から確認可能です。

-   [VS Code API | Visual Studio Code Extension API](https://code.visualstudio.com/api/references/vscode-api)

### 3\. コマンドの呼び出され方を定義

そして同じく既定で作成されたファイル`package.json`では、`extension.ts`で登録したコマンドの**実行のされ方**を定義しています。

```
{
  "activationEvents": [
    "onCommand:vs-devio-opener.helloWorld"
  ],
  //省略,
  "contributes": {
    "commands": [
      {
        "command": "vs-devio-opener.helloWorld",
        "title": "Hello World"
      }
    ]
  },
}

```

`activationEvents`では、**どのコマンドがどのイベント発生時に呼び出される（アクティベートされる）か**を定義します。上記では`onCommand:vs-devio-opener.helloWorld`と指定することにより、`vs-devio-opener.helloWorld`明示的に呼び出された時にそのコマンドがアクティベートされるようになります。利用可能なActivation Events一覧は下記で確認可能です。

-   [Activation Events | Visual Studio Code Extension API](https://code.visualstudio.com/api/references/activation-events)

一方で[contributes.commands](https://code.visualstudio.com/api/references/contribution-points#contributes.commands)では、コマンドに付与する呼び出しUIを定義します。上記では`vs-devio-opener.helloWorld`コマンドを`Hello World`というタイトルで呼び出せるようになっています。

そしてさらに**contributes.menus**を定義すれば、コマンドをCommand Palette以外から呼び出せるようになります。例えば下記のように`contributes.menus`で`editor/contex`を定義すると、エディター画面でのコンテキストメニューからコマンドを呼び出せるようになります。

```
  "activationEvents": [
    "onCommand:vscode-context.openDevio"
  ],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "vscode-context.openDevio",
        "title": "Open DevIO"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "when": "editorFocus",
          "command": "vscode-context.openDevio",
          "group": "myGroup@1"
        }
      ]
    }
  }
}
```

利用可能なcontributes.menus一覧は下記で確認可能です。

-   [contributes.menus - Contribution Points | Visual Studio Code Extension API](https://code.visualstudio.com/api/references/contribution-points#contributes.menus)

### 4\. 動作確認

Extensionの動作確認はVS Codeのデバッガーで実施可能です。

VS Codeのデバッガーで\[Run Extension\]をクリック。 ![](https://www.evernote.com/l/APeE7v8qouhKrar2JFopd262PBSCAEsuuCQB/image.png)

Command Paletteで\[Run Extension\]を選択。  
![](https://www.evernote.com/l/APdfnaucVCxF_5pSrUXpPCFp72DK2tRkE8AB/image.png)

すると別ウィンドウが開くので、Command Paletteで`Hello World`を実行します。 ![](https://www.evernote.com/l/APefmQWGE0tKarDq3LS-i0771VBsTO8rA_YB/image.png)

通知欄にメッセージが表示されました。デバッグで動かせましたね。 ![](https://www.evernote.com/l/APfF8hyljotBtqv_BRG0zyS3ZlCHDc-E8XwB/image.png)

もちろん、contributes.menusの定義によりコンテキストメニューに登録されていれば、そこからも実行可能です。 ![](https://www.evernote.com/l/APe5Jy3bWRlHiLaG7MAZJ1iPzTD9kVNRUgUB/image.png)

### 5\. VS Codeで拡張機能として利用可能にする

動作確認が出来たら、いよいよ実際にVS CodeでExtensionとして利用できるようにします。

まずREADMEを編集します。（デフォルトの内容のままだと`vsce package`実行時にエラーとなるため。）自分だけが使うのであれば簡単な内容で結構です。

```
# vs-devio-opener README

指定したDevelopersIOのページを開ける拡張機能です。
```

次の`vsce package`を実行してプロジェクトをパッケージします。[vsce](https://www.npmjs.com/package/vsce)はVisual Studio Code Extension Managerです。

```
npx vsce package
```

実行するとプロジェクトフォルダ内にvsixファイルが生成されます。

```
$ ls vs-devio-opener-0.0.1.vsix
vs-devio-opener-0.0.1.vsix
```

VS Codeの\[install from VSIX\]でvsixファイルを読み込みます。 ![](https://www.evernote.com/l/APdAoHPcHAFOt4zR_Y02rTjvEp1ZOYkXlEYB/image.png)

これにより登録したコマンドをVS Code拡張として呼び出せるようになりました。 ![](https://www.evernote.com/l/APdMT6GSCI5KhLv3ML0gwL52u2jg7AO48I0B/image.png)

### 補足：拡張機能の公開

VS Code Extensionの公開もvsceの実行で行えます。詳しくは下記をご覧ください。

-   [Publishing Extensions | Visual Studio Code Extension API](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## おわりに

VS Code拡張機能（Extension）の開発手順について簡潔にまとめてみました。

皆さんも自分だけのExtensionを作ってVS Codeでの開発作業の効率化を図っていきましょう。

以上