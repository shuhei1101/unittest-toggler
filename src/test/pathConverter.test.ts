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
        
        override getAffixPosition(): 'prefix' | 'suffix' {
            return this._isPrefix ? 'prefix' : 'suffix';
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
            getAffixPosition: () => 'prefix'
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const testFilePath = mockPathConverter.getTestFilePath(sourcePath);
        
        // 期待される結果をチェック
        if (testFilePath) {
            assert.strictEqual(testFilePath, '/workspace/tests/module/test_file.py');
        }
    });
    
    test('getTestFilePath - Javaプロジェクト構造での変換', () => {
        const sourceDir = '/path/to/project/src/java';
        const testDir = '/path/to/project/src/test';
        const sourcePath = '/path/to/project/src/java/com/example/demo/BackendApplication.java';
        
        // 設定をモック化
        const mockSettingsManager = {
            getSourceDirectory: () => sourceDir,
            getTestDirectory: () => testDir,
            getTestFileAffix: () => 'Test',
            getAffixPosition: () => 'suffix'
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const testFilePath = mockPathConverter.getTestFilePath(sourcePath);
        
        console.log(`[Test] sourcePath: ${sourcePath}`);
        console.log(`[Test] sourceDir: ${sourceDir}`);
        console.log(`[Test] testDir: ${testDir}`);
        console.log(`[Test] testFilePath: ${testFilePath}`);
        
        // 期待される結果をチェック
        if (testFilePath) {
            assert.strictEqual(testFilePath, '/path/to/project/src/test/com/example/demo/BackendApplicationTest.java');
        } else {
            assert.fail('testFilePathがundefinedです');
        }
    });

    test('getSourceFilePath - Javaプロジェクト構造での逆変換', () => {
        const sourceDir = '/path/to/project/src/java';
        const testDir = '/path/to/project/src/test';
        const testPath = '/path/to/project/src/test/com/example/demo/BackendApplicationTest.java';
        
        // 設定をモック化
        const mockSettingsManager = {
            getSourceDirectory: () => sourceDir,
            getTestDirectory: () => testDir,
            getTestFileAffix: () => 'Test',
            getAffixPosition: () => 'suffix'
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const sourceFilePath = mockPathConverter.getSourceFilePath(testPath);
        
        console.log(`[Test] testPath: ${testPath}`);
        console.log(`[Test] testDir: ${testDir}`);
        console.log(`[Test] sourceDir: ${sourceDir}`);
        console.log(`[Test] sourceFilePath: ${sourceFilePath}`);
        
        // 期待される結果をチェック
        if (sourceFilePath) {
            assert.strictEqual(sourceFilePath, '/path/to/project/src/java/com/example/demo/BackendApplication.java');
        } else {
            assert.fail('sourceFilePathがundefinedです');
        }
    });
    
    test('getTestFilePath - パス検証のエッジケース', () => {
        // エッジケースを確認するテスト
        const testCases = [
            {
                name: '末尾にスラッシュがあるディレクトリ',
                sourceDir: '/path/to/project/src/java/',
                testDir: '/path/to/project/src/test/',
                sourcePath: '/path/to/project/src/java/com/example/demo/BackendApplication.java',
                expected: '/path/to/project/src/test/com/example/demo/BackendApplicationTest.java'
            },
            {
                name: '正規化が必要なパス',
                sourceDir: '/path/to/project/src/java',
                testDir: '/path/to/project/src/test',
                sourcePath: '/path/to/project/src/java/../java/com/example/demo/BackendApplication.java',
                expected: '/path/to/project/src/test/com/example/demo/BackendApplicationTest.java'
            },
            {
                name: 'ディレクトリ名がサブストリングとして含まれる場合',
                sourceDir: '/path/to/project/src/java',
                testDir: '/path/to/project/src/test',
                sourcePath: '/path/to/project/src/java-backup/com/example/demo/BackendApplication.java',
                expected: undefined // ソースディレクトリ外なのでundefined
            }
        ];
        
        testCases.forEach((testCase) => {
            const mockSettingsManager = {
                getSourceDirectory: () => testCase.sourceDir,
                getTestDirectory: () => testCase.testDir,
                getTestFileAffix: () => 'Test',
                getAffixPosition: () => 'suffix'
            } as SettingsManager;
            
            const mockPathConverter = new PathConverter(mockSettingsManager);
            const testFilePath = mockPathConverter.getTestFilePath(testCase.sourcePath);
            
            console.log(`[Test] ${testCase.name}`);
            console.log(`[Test] sourcePath: ${testCase.sourcePath}`);
            console.log(`[Test] sourceDir: ${testCase.sourceDir}`);
            console.log(`[Test] testDir: ${testCase.testDir}`);
            console.log(`[Test] testFilePath: ${testFilePath}`);
            console.log(`[Test] expected: ${testCase.expected}`);
            
            assert.strictEqual(testFilePath, testCase.expected, `${testCase.name}で失敗`);
        });
    });
    
    test('getTestFilePath - Windows環境でのパス変換', () => {
        // Windowsスタイルのパス（実際にはNode.jsのpathモジュールがクロスプラットフォーム対応）
        const sourceDir = '/c/Users/Test/Project/src';  // Unix形式でWindowsのCドライブを表現
        const testDir = '/c/Users/Test/Project/tests';
        const sourcePath = '/c/Users/Test/Project/src/Module/File.py';
        
        // 設定をモック化
        const mockSettingsManager = {
            getSourceDirectory: () => sourceDir,
            getTestDirectory: () => testDir,
            getTestFileAffix: () => 'test_',
            getAffixPosition: () => 'prefix'
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const testFilePath = mockPathConverter.getTestFilePath(sourcePath);
        
        if (testFilePath) {
            const expectedPath = '/c/Users/Test/Project/tests/Module/test_File.py';
            
            console.log(`[Test Windows] sourcePath: ${sourcePath}`);
            console.log(`[Test Windows] testFilePath: ${testFilePath}`);
            console.log(`[Test Windows] expected: ${expectedPath}`);
            
            assert.strictEqual(testFilePath, expectedPath);
        } else {
            assert.fail('Windows形式のパスでtestFilePathがundefinedです');
        }
    });

    test('getSourceFilePath - Windows環境での逆変換', () => {
        // Windowsスタイルのパス（Unix形式で表現）
        const sourceDir = '/c/Users/Test/Project/src';
        const testDir = '/c/Users/Test/Project/tests';
        const testPath = '/c/Users/Test/Project/tests/Module/test_File.py';
        
        // 設定をモック化
        const mockSettingsManager = {
            getSourceDirectory: () => sourceDir,
            getTestDirectory: () => testDir,
            getTestFileAffix: () => 'test_',
            getAffixPosition: () => 'prefix'
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const sourceFilePath = mockPathConverter.getSourceFilePath(testPath);
        
        if (sourceFilePath) {
            const expectedPath = '/c/Users/Test/Project/src/Module/File.py';
            
            console.log(`[Test Windows] testPath: ${testPath}`);
            console.log(`[Test Windows] sourceFilePath: ${sourceFilePath}`);
            console.log(`[Test Windows] expected: ${expectedPath}`);
            
            assert.strictEqual(sourceFilePath, expectedPath);
        } else {
            assert.fail('Windows形式のパスでsourceFilePathがundefinedです');
        }
    });

    test('getTestFilePath - Windows環境での大文字小文字混在パターン', () => {
        // 異なる大文字小文字のパターン（Windowsでは通常同一視される）
        const sourceDir = '/c/users/test/project/src';  // 小文字
        const testDir = '/c/users/test/project/tests';
        const sourcePath = '/c/Users/Test/Project/Different/module/file.py';  // 別ディレクトリ
        
        // 設定をモック化
        const mockSettingsManager = {
            getSourceDirectory: () => sourceDir,
            getTestDirectory: () => testDir,
            getTestFileAffix: () => 'Test',
            getAffixPosition: () => 'suffix'
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const testFilePath = mockPathConverter.getTestFilePath(sourcePath);
        
        console.log(`[Test Windows Case] sourcePath: ${sourcePath}`);
        console.log(`[Test Windows Case] sourceDir: ${sourceDir}`);
        console.log(`[Test Windows Case] testFilePath: ${testFilePath}`);
        
        // この場合、実際に別のディレクトリなので、undefinedになることを期待
        assert.strictEqual(testFilePath, undefined);
    });

    test('getTestFilePath - Windows環境での大文字小文字が一致するパターン', () => {
        // 大文字小文字が異なるが、同じディレクトリを指すパターン
        const sourceDir = '/c/users/test/project/src';  // 小文字
        const testDir = '/c/users/test/project/tests';
        const sourcePath = '/c/users/test/project/src/module/file.py';  // 一致するパス
        
        // 設定をモック化
        const mockSettingsManager = {
            getSourceDirectory: () => sourceDir,
            getTestDirectory: () => testDir,
            getTestFileAffix: () => 'Test',
            getAffixPosition: () => 'suffix'
        } as SettingsManager;
        
        const mockPathConverter = new PathConverter(mockSettingsManager);
        const testFilePath = mockPathConverter.getTestFilePath(sourcePath);
        
        if (testFilePath) {
            const expectedPath = '/c/users/test/project/tests/module/fileTest.py';
            
            console.log(`[Test Windows Case Match] sourcePath: ${sourcePath}`);
            console.log(`[Test Windows Case Match] testFilePath: ${testFilePath}`);
            console.log(`[Test Windows Case Match] expected: ${expectedPath}`);
            
            assert.strictEqual(testFilePath, expectedPath);
        } else {
            assert.fail('Windows環境での大文字小文字が一致するケースでtestFilePathがundefinedです');
        }
    });

    test('PathConverter - プラットフォーム依存のパス正規化', () => {
        // Windows風の絶対パスの場合の動作をテスト
        // (実際のWindows環境では process.platform === 'win32' になる)
        const testCases = [
            {
                name: '通常のUnixパス',
                sourceDir: '/home/user/project/src',
                testDir: '/home/user/project/tests',
                sourcePath: '/home/user/project/src/utils/helper.js',
                expected: '/home/user/project/tests/utils/test_helper.js'
            },
            {
                name: 'C:ドライブ形式のパス',
                sourceDir: '/c/projects/myapp/src',
                testDir: '/c/projects/myapp/tests', 
                sourcePath: '/c/projects/myapp/src/services/api.js',
                expected: '/c/projects/myapp/tests/services/test_api.js'
            },
            {
                name: '深いディレクトリ構造',
                sourceDir: '/d/workspace/complex/project/src/main/java',
                testDir: '/d/workspace/complex/project/src/test/java',
                sourcePath: '/d/workspace/complex/project/src/main/java/com/example/service/UserService.java',
                expected: '/d/workspace/complex/project/src/test/java/com/example/service/test_UserService.java'
            }
        ];

        testCases.forEach((testCase) => {
            const mockSettingsManager = {
                getSourceDirectory: () => testCase.sourceDir,
                getTestDirectory: () => testCase.testDir,
                getTestFileAffix: () => 'test_',
                getAffixPosition: () => 'prefix'
            } as SettingsManager;

            const mockPathConverter = new PathConverter(mockSettingsManager);
            const result = mockPathConverter.getTestFilePath(testCase.sourcePath);

            console.log(`[${testCase.name}] sourcePath: ${testCase.sourcePath}`);
            console.log(`[${testCase.name}] result: ${result}`);
            console.log(`[${testCase.name}] expected: ${testCase.expected}`);

            assert.strictEqual(result, testCase.expected, `${testCase.name}で失敗`);
        });
    });
});
