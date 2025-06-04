// 設定管理クラスの実装
import * as vscode from 'vscode';

/**
 * 新しいファイルを開く際のグループ配置オプション
 */
export enum OpenLocationOption {
    CurrentGroup = 'currentGroup',
    AnotherGroup = 'anotherGroup'
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
     * プロジェクトのソースディレクトリの絶対パスを取得する
     * @returns ソースディレクトリの絶対パス
     */
    public getSourceDirectory(): string {
        return this.get<string>('sourceDirectory', '');
    }

    /**
     * プロジェクトのテストディレクトリの絶対パスを取得する
     * @returns テストディレクトリの絶対パス
     */
    public getTestDirectory(): string {
        return this.get<string>('testDirectory', '');
    }

    /**
     * テストファイルの付加文字列を取得する
     * @returns 付加文字列
     */
    public getTestFileAffix(): string {
        return this.get<string>('testFileAffix', 'test_');
    }

    /**
     * テストファイルの付加文字列の位置を取得する
     * @returns 付加文字列の位置（'prefix' または 'suffix'）
     */
    public getAffixPosition(): 'prefix' | 'suffix' {
        // 新しい設定を優先し、なければ旧設定から変換
        const newSetting = this.get<string>('affixPosition', '');
        if (newSetting === 'prefix' || newSetting === 'suffix') {
            return newSetting;
        }
        
        // 旧設定から変換（後方互換性）
        const isPrefix = this.get<boolean>('isPrefix', true);
        return isPrefix ? 'prefix' : 'suffix';
    }

    /**
     * 付加文字列が接頭辞かどうかを取得する
     * @deprecated getAffixPosition()を使用してください
     * @returns 接頭辞の場合はtrue
     */
    public isPrefix(): boolean {
        return this.getAffixPosition() === 'prefix';
    }

    // 重複定義されたgetメソッドを削除
    
    
    /**
     * 新しいファイルを開く際のグループ配置を取得する
     * @returns グループ配置オプション
     */
    public getOpenLocation(): OpenLocationOption {
        const value = this.get<string>('openLocation', 'anotherGroup');
        console.log(`[unittest-toggler] 取得した設定値: ${value}`);
        
        // 文字列を適切な列挙型に変換
        switch (value) {
            case 'currentGroup': 
            case 'activeGroup': // 後方互換性のためにactiveGroupも受け付ける
                return OpenLocationOption.CurrentGroup;
            case 'anotherGroup':
            case 'otherGroup': // 後方互換性のためにotherGroupも受け付ける
                return OpenLocationOption.AnotherGroup;
            case 'verticalGroup': // 後方互換性のために古い値も受け付けるが、AnotherGroupに変換
            case 'horizontalGroup': // 後方互換性のために古い値も受け付けるが、AnotherGroupに変換
            default: 
                console.log(`[unittest-toggler] 設定値を変換: ${value} -> anotherGroup（デフォルト値）`);
                return OpenLocationOption.AnotherGroup;
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
