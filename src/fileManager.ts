// ファイル操作機能の実装
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * ファイル操作を担当するクラス
 */
export class FileManager {
    /**
     * ファイルが存在するか確認する
     * @param filePath ファイルパス
     * @returns 存在する場合はtrue
     */
    public fileExists(filePath: string): boolean {
        try {
            return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
        } catch (error) {
            return false;
        }
    }

    /**
     * ディレクトリが存在するか確認する
     * @param dirPath ディレクトリパス
     * @returns 存在する場合はtrue
     */
    public directoryExists(dirPath: string): boolean {
        try {
            return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
        } catch (error) {
            return false;
        }
    }

    /**
     * ディレクトリを再帰的に作成する
     * @param dirPath ディレクトリパス
     */
    public createDirectory(dirPath: string): void {
        if (!this.directoryExists(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * ファイルを作成する
     * @param filePath ファイルパス
     * @param content ファイル内容
     */
    public createFile(filePath: string, content: string = ''): void {
        const dirPath = path.dirname(filePath);
        this.createDirectory(dirPath);
        fs.writeFileSync(filePath, content);
    }

    /**
     * ファイルを開く
     * @param filePath ファイルパス
     */
    public async openFile(filePath: string): Promise<vscode.TextEditor | undefined> {
        try {
            // 1. まず visibleTextEditors で探す (グループ情報つきで見えているファイル)
            const visibleEditors = vscode.window.visibleTextEditors;
            for (const editor of visibleEditors) {
                if (editor.document.uri.fsPath === filePath) {
                    // 既に表示されているエディタをアクティブにする (グループ情報を維持)
                    return await vscode.window.showTextDocument(editor.document, {
                        viewColumn: editor.viewColumn,
                        preserveFocus: false // フォーカスを強制的に移す
                    });
                }
            }
            
            // 2. 次に workspace.textDocuments で探す (開かれているが非表示のファイル)
            const openedDocuments = vscode.workspace.textDocuments;
            for (const document of openedDocuments) {
                if (document.uri.fsPath === filePath) {
                    // 既に開かれているドキュメントをアクティブにする
                    return await vscode.window.showTextDocument(document, {
                        preserveFocus: false // フォーカスを強制的に移す
                    });
                }
            }

            // ファイルが存在しない場合は空のファイルを作成
            // createFile メソッドでは自動的にディレクトリも作成される
            if (!this.fileExists(filePath)) {
                // ファイルの親ディレクトリを作成
                const dirPath = path.dirname(filePath);
                this.createDirectory(dirPath);
                
                // ファイルを作成
                this.createFile(filePath);
            }
            
            // ファイルをVSCodeで開く
            const document = await vscode.workspace.openTextDocument(filePath);
            return await vscode.window.showTextDocument(document);
        } catch (error) {
            console.error(`ファイルを開けませんでした: ${filePath}`, error);
            vscode.window.showErrorMessage(`ファイルを開けませんでした: ${filePath}`);
            return undefined;
        }
    }
}
