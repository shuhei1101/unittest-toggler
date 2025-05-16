// コマンドハンドラークラスの実装
import * as path from 'path';
import * as vscode from 'vscode';
import { SettingsManager } from './settings';
import { PathConverter } from './pathConverter';
import { FileManager } from './fileManager';

/**
 * コマンドの実行を担当するクラス
 */
export class CommandHandler {
    private settingsManager: SettingsManager;
    private pathConverter: PathConverter;
    private fileManager: FileManager;

    constructor(
        settingsManager: SettingsManager,
        pathConverter: PathConverter,
        fileManager: FileManager
    ) {
        this.settingsManager = settingsManager;
        this.pathConverter = pathConverter;
        this.fileManager = fileManager;
    }

    /**
     * モジュールとテストファイルを切り替える
     */
    public async toggleUnitTest(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('ファイルが開かれていません');
            return;
        }

        const filePath = editor.document.uri.fsPath;
        
        // ファイルがテストファイルかどうか判断
        const isTest = this.pathConverter.isTestFile(filePath);
        let targetPath: string | undefined;

        if (isTest) {
            // テストファイルからソースファイルへ
            targetPath = this.pathConverter.getSourceFilePath(filePath);
            if (!targetPath) {
                vscode.window.showErrorMessage('対応するソースファイルのパスを特定できませんでした');
                return;
            }
        } else {
            // ソースファイルからテストファイルへ
            targetPath = this.pathConverter.getTestFilePath(filePath);
            if (!targetPath) {
                vscode.window.showErrorMessage('対応するテストファイルのパスを特定できませんでした');
                return;
            }
        }

        // ファイルを開く
        await this.fileManager.openFile(targetPath);
    }

    /**
     * テストファイルを生成する
     * @param uris 選択されたファイルのURI配列
     */
    public async generateUnitTest(uris: vscode.Uri[]): Promise<void> {
        if (!uris || uris.length === 0) {
            vscode.window.showErrorMessage('ファイルが選択されていません');
            return;
        }

        const sourceDir = this.settingsManager.getSourceDirectory();
        const testDir = this.settingsManager.getTestDirectory();

        // 処理成功カウンタ
        let successCount = 0;
        let errorCount = 0;

        for (const uri of uris) {
            const filePath = uri.fsPath;
            const relativePath = this.pathConverter.getWorkspaceRelativePath(filePath);
            
            if (!relativePath) {
                errorCount++;
                continue;
            }

            // ファイルがソースディレクトリまたはテストディレクトリに属しているか確認
            const inSourceDir = relativePath.startsWith(sourceDir);
            const inTestDir = relativePath.startsWith(testDir);

            if (!inSourceDir && !inTestDir) {
                vscode.window.showWarningMessage(`ファイル "${path.basename(filePath)}" はソースディレクトリまたはテストディレクトリに属していません`);
                errorCount++;
                continue;
            }

            let targetPath: string | undefined;
            
            if (inSourceDir) {
                // ソースファイルの場合はテストファイルを生成
                targetPath = this.pathConverter.getTestFilePath(filePath);
            } else {
                // テストファイルの場合はソースファイルを生成
                targetPath = this.pathConverter.getSourceFilePath(filePath);
            }

            if (!targetPath) {
                vscode.window.showErrorMessage(`ファイル "${path.basename(filePath)}" の対応するファイルパスを特定できませんでした`);
                errorCount++;
                continue;
            }

            // ファイルを開く（ファイルが存在しない場合は作成される）
            await this.fileManager.openFile(targetPath);
            successCount++;
        }

        // 処理結果を表示
        if (successCount > 0) {
            vscode.window.showInformationMessage(`${successCount}個のファイルを処理しました`);
        }
        
        if (errorCount > 0) {
            vscode.window.showWarningMessage(`${errorCount}個のファイルを処理できませんでした`);
        }
    }
}
