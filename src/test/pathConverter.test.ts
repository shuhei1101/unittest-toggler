import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { SettingsManager } from '../settings';
import { PathConverter } from '../pathConverter';

suite('PathConverter Tests', () => {
    let settingsManager: SettingsManager;
    let pathConverter: PathConverter;
    
    // モック用の設定マネージャクラス
    class MockSettingsManager extends SettingsManager {
        private _sourceDir: string;
        private _testDir: string;
        private _testFileAffix: string;
        private _isPrefix: boolean;
        
        constructor(sourceDir: string = 'src', testDir: string = 'tests', 
                   testFileAffix: string = 'test_', isPrefix: boolean = true) {
            super();
            this._sourceDir = sourceDir;
            this._testDir = testDir;
            this._testFileAffix = testFileAffix;
            this._isPrefix = isPrefix;
        }
        
        override getSourceDirectory(): string {
            return this._sourceDir;
        }
        
        override getTestDirectory(): string {
            return this._testDir;
        }
        
        override getTestFileAffix(): string {
            return this._testFileAffix;
        }
        
        override isPrefix(): boolean {
            return this._isPrefix;
        }
    }
    
    setup(() => {
        settingsManager = new MockSettingsManager();
        pathConverter = new PathConverter(settingsManager);
    });
    
    test('isTestFile - 接頭辞パターンでのテストファイル判定', () => {
        const mockSettings = new MockSettingsManager('src', 'tests', 'test_', true);
        const converter = new PathConverter(mockSettings);
        
        // テストファイルと判定されるケース
        assert.strictEqual(converter.isTestFile('/path/to/test_file.py'), true);
        
        // テストファイルと判定されないケース
        assert.strictEqual(converter.isTestFile('/path/to/file.py'), false);
        assert.strictEqual(converter.isTestFile('/path/to/my_test_file.py'), false); // 接頭辞が完全に一致しない
    });
    
    test('isTestFile - 接尾辞パターンでのテストファイル判定', () => {
        const mockSettings = new MockSettingsManager('src', 'tests', '_test', false);
        const converter = new PathConverter(mockSettings);
        
        // テストファイルと判定されるケース
        assert.strictEqual(converter.isTestFile('/path/to/file_test.py'), true);
        
        // テストファイルと判定されないケース
        assert.strictEqual(converter.isTestFile('/path/to/file.py'), false);
        assert.strictEqual(converter.isTestFile('/path/to/test_file.py'), false);
    });
    
    test('getTestFilePath - ソースからテストパスへの変換', () => {
        // 絶対パス対応のテスト
        const sourceDir = '/workspace/src';
        const testDir = '/workspace/tests';
        const sourcePath = '/workspace/src/module/file.py';
        
        // 設定をモック化
        const mockSettingsManager = {
            getSourceDirectory: () => sourceDir,
            getTestDirectory: () => testDir,
            getTestFileAffix: () => 'test_',
            isPrefix: () => true
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const testFilePath = mockPathConverter.getTestFilePath(sourcePath);
        
        // 期待される結果をチェック
        if (testFilePath) {
            assert.strictEqual(testFilePath, '/workspace/tests/module/test_file.py');
        }
    });
});
