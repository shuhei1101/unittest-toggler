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
     * ソースファイルからテストファイルへのパスを生成する
     * @param sourcePath ソースファイルの絶対パス
     * @returns テストファイルの絶対パス
     */
    public getTestFilePath(sourcePath: string): string | undefined {
        const sourceDir = this.settingsManager.getSourceDirectory();
        const testDir = this.settingsManager.getTestDirectory();

        // 設定が空の場合は処理しない
        if (!sourceDir || !testDir) {
            console.log('[unittest-toggler] sourceDirectory または testDirectory が設定されていません');
            return undefined;
        }

        // ソースディレクトリ内のファイルかどうかを確認
        if (!sourcePath.startsWith(sourceDir + path.sep) && sourcePath !== sourceDir) {
            console.log(`[unittest-toggler] ファイルがソースディレクトリ外にあります: ${sourcePath}`);
            return undefined;
        }

        // ソースディレクトリからの相対パスを取得
        const relativeToSource = path.relative(sourceDir, sourcePath);
        
        // テストファイルのパスを生成
        const testFilePath = path.join(testDir, relativeToSource);

        // ファイル名部分を変更
        const testFileDir = path.dirname(testFilePath);
        const sourceFileName = path.basename(sourcePath);
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

        return path.join(testFileDir, testFileName);
    }

    /**
     * テストファイルからソースファイルへのパスを生成する
     * @param testPath テストファイルの絶対パス
     * @returns ソースファイルの絶対パス
     */
    public getSourceFilePath(testPath: string): string | undefined {
        const sourceDir = this.settingsManager.getSourceDirectory();
        const testDir = this.settingsManager.getTestDirectory();

        // 設定が空の場合は処理しない
        if (!sourceDir || !testDir) {
            console.log('[unittest-toggler] sourceDirectory または testDirectory が設定されていません');
            return undefined;
        }

        // テストディレクトリ内のファイルかどうかを確認
        if (!testPath.startsWith(testDir + path.sep) && testPath !== testDir) {
            console.log(`[unittest-toggler] ファイルがテストディレクトリ外にあります: ${testPath}`);
            return undefined;
        }

        // テストディレクトリからの相対パスを取得
        const relativeToTest = path.relative(testDir, testPath);
        
        // ソースファイルのパスを生成
        const sourceFilePath = path.join(sourceDir, relativeToTest);

        // ファイル名部分を変更
        const sourceFileDir = path.dirname(sourceFilePath);
        const testFileName = path.basename(testPath);
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

        return path.join(sourceFileDir, sourceFileName);
    }
}
