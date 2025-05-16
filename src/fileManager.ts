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
            // ファイルが存在しない場合は空のファイルを作成
            if (!this.fileExists(filePath)) {
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
