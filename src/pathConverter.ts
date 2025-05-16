// パス変換ロジックの実装
import * as path from 'path';
import * as vscode from 'vscode';
import { SettingsManager } from './settings';

/**
 * ファイルパスの変換を担当するクラス
 */
export class PathConverter {
    private settingsManager: SettingsManager;

    constructor(settingsManager: SettingsManager) {
        this.settingsManager = settingsManager;
    }

    /**
     * 与えられたファイルパスがテストファイルかどうかを判断する
     * @param filePath ファイルパス
     * @returns テストファイルの場合はtrue
     */
    public isTestFile(filePath: string): boolean {
        const fileName = path.basename(filePath);
        const affix = this.settingsManager.getTestFileAffix();
        const isPrefix = this.settingsManager.isPrefix();

        if (isPrefix) {
            return fileName.startsWith(affix);
        } else {
            // ファイル拡張子を除外して確認
            const extname = path.extname(fileName);
            const fileNameWithoutExt = fileName.slice(0, -extname.length);
            return fileNameWithoutExt.endsWith(affix);
        }
    }

    /**
     * ワークスペース内の相対パスを取得する
     * @param filePath 絶対ファイルパス
     * @returns ワークスペースルートからの相対パス
     */
    public getWorkspaceRelativePath(filePath: string): string | undefined {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return undefined;
        }

        // ファイルが属するワークスペースフォルダを見つける
        for (const folder of workspaceFolders) {
            const relativePath = path.relative(folder.uri.fsPath, filePath);
            if (!relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
                return relativePath;
            }
        }

        return undefined;
    }

    /**
     * ソースファイルからテストファイルへのパスを生成する
     * @param sourcePath ソースファイルの絶対パス
     * @returns テストファイルの絶対パス
     */
    public getTestFilePath(sourcePath: string): string | undefined {
        const sourceRelativePath = this.getWorkspaceRelativePath(sourcePath);
        if (!sourceRelativePath) {
            return undefined;
        }

        const sourceDir = this.settingsManager.getSourceDirectory();
        const testDir = this.settingsManager.getTestDirectory();

        // ソースディレクトリ外のファイルは処理しない
        if (!sourceRelativePath.startsWith(sourceDir + path.sep)) {
            return undefined;
        }

        const relativeToSrc = path.relative(sourceDir, sourceRelativePath);
        const testRelativePath = path.join(testDir, relativeToSrc);

        // ファイル名部分を変更
        const testFileDir = path.dirname(testRelativePath);
        const sourceFileName = path.basename(sourceRelativePath);
        const sourceFileExt = path.extname(sourceFileName);
        const sourceFileNameWithoutExt = sourceFileName.slice(0, -sourceFileExt.length);
        
        const affix = this.settingsManager.getTestFileAffix();
        const isPrefix = this.settingsManager.isPrefix();

        let testFileName;
        if (isPrefix) {
            testFileName = `${affix}${sourceFileNameWithoutExt}${sourceFileExt}`;
        } else {
            testFileName = `${sourceFileNameWithoutExt}${affix}${sourceFileExt}`;
        }

        // ワークスペースルートからの絶対パスを生成
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return undefined;
        }

        return path.join(workspaceFolders[0].uri.fsPath, testFileDir, testFileName);
    }

    /**
     * テストファイルからソースファイルへのパスを生成する
     * @param testPath テストファイルの絶対パス
     * @returns ソースファイルの絶対パス
     */
    public getSourceFilePath(testPath: string): string | undefined {
        const testRelativePath = this.getWorkspaceRelativePath(testPath);
        if (!testRelativePath) {
            return undefined;
        }

        const sourceDir = this.settingsManager.getSourceDirectory();
        const testDir = this.settingsManager.getTestDirectory();

        // テストディレクトリ外のファイルは処理しない
        if (!testRelativePath.startsWith(testDir + path.sep)) {
            return undefined;
        }

        const relativeToTest = path.relative(testDir, testRelativePath);
        const sourceRelativePath = path.join(sourceDir, relativeToTest);

        // ファイル名部分を変更
        const sourceFileDir = path.dirname(sourceRelativePath);
        const testFileName = path.basename(testRelativePath);
        const testFileExt = path.extname(testFileName);
        const testFileNameWithoutExt = testFileName.slice(0, -testFileExt.length);
        
        const affix = this.settingsManager.getTestFileAffix();
        const isPrefix = this.settingsManager.isPrefix();

        let sourceFileName;
        if (isPrefix) {
            // 接頭辞を削除
            if (testFileNameWithoutExt.startsWith(affix)) {
                sourceFileName = `${testFileNameWithoutExt.substring(affix.length)}${testFileExt}`;
            } else {
                sourceFileName = testFileName; // アフィックスがない場合はそのまま
            }
        } else {
            // 接尾辞を削除
            if (testFileNameWithoutExt.endsWith(affix)) {
                sourceFileName = `${testFileNameWithoutExt.substring(0, testFileNameWithoutExt.length - affix.length)}${testFileExt}`;
            } else {
                sourceFileName = testFileName; // アフィックスがない場合はそのまま
            }
        }

        // ワークスペースルートからの絶対パスを生成
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return undefined;
        }

        return path.join(workspaceFolders[0].uri.fsPath, sourceFileDir, sourceFileName);
    }
}
