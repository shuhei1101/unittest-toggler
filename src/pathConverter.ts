// パス変換ロジックの実装
import * as path from 'path';
import * as vscode from 'vscode';
import { SettingsManager } from './settings';

/**
 * クロスプラットフォーム対応のパス正規化関数
 * @param filePath 正規化するファイルパス
 * @returns 正規化されたパス
 */
function normalizePath(filePath: string): string {
    const resolved = path.resolve(filePath);
    // Windows環境では大文字小文字を統一
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

/**
 * 二つのパスが同じディレクトリ階層にあるかチェック
 * @param childPath 子パス
 * @param parentPath 親パス
 * @returns 子パスが親パス以下にある場合true
 */
function isChildPath(childPath: string, parentPath: string): boolean {
    const normalizedChild = normalizePath(childPath);
    const normalizedParent = normalizePath(parentPath);
    
    const relativePath = path.relative(normalizedParent, normalizedChild);
    return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

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
        const affixPosition = this.settingsManager.getAffixPosition();

        if (affixPosition === 'prefix') {
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
            console.log(`[unittest-toggler] sourceDirectory または testDirectory が設定されていません。ソースファイル: ${sourcePath}`);
            return undefined;
        }

        // パスを正規化してディレクトリチェック
        if (!isChildPath(sourcePath, sourceDir)) {
            console.log(`[unittest-toggler] ファイルがソースディレクトリ外にあります: ${sourcePath}`);
            console.log(`[unittest-toggler] ソースディレクトリ: ${sourceDir}`);
            console.log(`[unittest-toggler] プラットフォーム: ${process.platform}`);
            return undefined;
        }

        // ソースディレクトリからの相対パスを取得
        const normalizedSourceDir = path.resolve(sourceDir);
        const normalizedSourcePath = path.resolve(sourcePath);
        const relativeToSource = path.relative(normalizedSourceDir, normalizedSourcePath);
        
        // テストファイルのパスを生成（正規化されたテストディレクトリを使用）
        const testFilePath = path.join(path.resolve(testDir), relativeToSource);

        // ファイル名部分を変更
        const testFileDir = path.dirname(testFilePath);
        const sourceFileName = path.basename(sourcePath);
        const sourceFileExt = path.extname(sourceFileName);
        const sourceFileNameWithoutExt = sourceFileName.slice(0, -sourceFileExt.length);
        
        const affix = this.settingsManager.getTestFileAffix();
        const affixPosition = this.settingsManager.getAffixPosition();

        let testFileName;
        if (affixPosition === 'prefix') {
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
            console.log(`[unittest-toggler] sourceDirectory または testDirectory が設定されていません。テストファイル: ${testPath}`);
            return undefined;
        }

        // パスを正規化してディレクトリチェック
        if (!isChildPath(testPath, testDir)) {
            console.log(`[unittest-toggler] ファイルがテストディレクトリ外にあります: ${testPath}`);
            console.log(`[unittest-toggler] テストディレクトリ: ${testDir}`);
            console.log(`[unittest-toggler] プラットフォーム: ${process.platform}`);
            return undefined;
        }

        // テストディレクトリからの相対パスを取得
        const normalizedTestDir = path.resolve(testDir);
        const normalizedTestPath = path.resolve(testPath);
        const relativeToTest = path.relative(normalizedTestDir, normalizedTestPath);
        
        // ソースファイルのパスを生成（正規化されたソースディレクトリを使用）
        const sourceFilePath = path.join(path.resolve(sourceDir), relativeToTest);

        // ファイル名部分を変更
        const sourceFileDir = path.dirname(sourceFilePath);
        const testFileName = path.basename(testPath);
        const testFileExt = path.extname(testFileName);
        const testFileNameWithoutExt = testFileName.slice(0, -testFileExt.length);
        
        const affix = this.settingsManager.getTestFileAffix();
        const affixPosition = this.settingsManager.getAffixPosition();

        let sourceFileName;
        if (affixPosition === 'prefix') {
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
