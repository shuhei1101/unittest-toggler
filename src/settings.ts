// 設定管理クラスの実装
import * as vscode from 'vscode';

/**
 * 新しいファイルを開く際のグループ配置オプション
 */
export enum OpenLocationOption {
    ActiveGroup = 'activeGroup',
    OtherGroup = 'otherGroup',
    VerticalGroup = 'verticalGroup',
    HorizontalGroup = 'horizontalGroup'
}

/**
 * 拡張機能の設定を管理するクラス
 */
export class SettingsManager {
    /**
     * 設定から特定の値を取得する
     * @param key 設定キー
     * @param defaultValue デフォルト値
     * @returns 設定値またはデフォルト値
     */
    public get<T>(key: string, defaultValue: T): T {
        const config = vscode.workspace.getConfiguration('unittestToggler');
        const value = config.get<T>(key, defaultValue);
        console.log(`[unittest-toggler] 設定取得 - キー: ${key}, 値: ${value}, 型: ${typeof value}`);
        return value;
    }

    /**
     * プロジェクトのソースディレクトリを取得する
     * @returns ソースディレクトリ名
     */
    public getSourceDirectory(): string {
        return this.get<string>('sourceDirectory', 'src');
    }

    /**
     * プロジェクトのテストディレクトリを取得する
     * @returns テストディレクトリ名
     */
    public getTestDirectory(): string {
        return this.get<string>('testDirectory', 'tests');
    }

    /**
     * テストファイルの付加文字列を取得する
     * @returns 付加文字列
     */
    public getTestFileAffix(): string {
        return this.get<string>('testFileAffix', 'test_');
    }

    /**
     * 付加文字列が接頭辞かどうかを取得する
     * @returns 接頭辞の場合はtrue
     */
    public isPrefix(): boolean {
        return this.get<boolean>('isPrefix', true);
    }

    // 重複定義されたgetメソッドを削除
    
    
    /**
     * 新しいファイルを開く際のグループ配置を取得する
     * @returns グループ配置オプション
     */
    public getOpenLocation(): OpenLocationOption {
        const value = this.get<string>('openLocation', 'activeGroup');
        console.log(`[unittest-toggler] 取得した設定値: ${value}`);
        
        // 文字列を適切な列挙型に変換
        switch (value) {
            case 'activeGroup': return OpenLocationOption.ActiveGroup;
            case 'otherGroup': return OpenLocationOption.OtherGroup;
            case 'verticalGroup': return OpenLocationOption.VerticalGroup;
            case 'horizontalGroup': return OpenLocationOption.HorizontalGroup;
            default: 
                console.log(`[unittest-toggler] 不明な設定値: ${value}, デフォルト値を使用します`);
                return OpenLocationOption.ActiveGroup;
        }
    }

    /**
     * 設定変更イベントをリッスンする
     * @param callback 設定変更時のコールバック
     * @returns 購読解除用のDisposable
     */
    public onDidChangeConfiguration(callback: () => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('unittestToggler')) {
                callback();
            }
        });
    }
}
