// 設定管理クラスの実装
import * as vscode from 'vscode';

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
        return config.get<T>(key, defaultValue);
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
