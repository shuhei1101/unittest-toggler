import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FileManager } from '../fileManager';

suite('FileManager Tests', () => {
    let fileManager: FileManager;
    let tempDir: string;
    
    setup(() => {
        fileManager = new FileManager();
        // 一時ディレクトリを作成
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unittest-toggler-test-'));
    });
    
    teardown(() => {
        // テスト後に一時ディレクトリを削除
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
    
    test('fileExists - ファイル存在確認', () => {
        const testFilePath = path.join(tempDir, 'test-file.txt');
        
        // ファイルが存在しないことを確認
        assert.strictEqual(fileManager.fileExists(testFilePath), false);
        
        // ファイルを作成
        fs.writeFileSync(testFilePath, 'test');
        
        // ファイルが存在することを確認
        assert.strictEqual(fileManager.fileExists(testFilePath), true);
    });
    
    test('directoryExists - ディレクトリ存在確認', () => {
        const testDirPath = path.join(tempDir, 'test-dir');
        
        // ディレクトリが存在しないことを確認
        assert.strictEqual(fileManager.directoryExists(testDirPath), false);
        
        // ディレクトリを作成
        fs.mkdirSync(testDirPath);
        
        // ディレクトリが存在することを確認
        assert.strictEqual(fileManager.directoryExists(testDirPath), true);
    });
    
    test('createDirectory - ディレクトリ作成', () => {
        const testDirPath = path.join(tempDir, 'nested', 'dirs');
        
        // ディレクトリが存在しないことを確認
        assert.strictEqual(fileManager.directoryExists(testDirPath), false);
        
        // ディレクトリを作成
        fileManager.createDirectory(testDirPath);
        
        // ディレクトリが存在することを確認
        assert.strictEqual(fileManager.directoryExists(testDirPath), true);
    });
    
    test('createFile - ファイル作成', () => {
        const testFilePath = path.join(tempDir, 'nested', 'dirs', 'test-file.txt');
        const content = 'Test content';
        
        // ファイルが存在しないことを確認
        assert.strictEqual(fileManager.fileExists(testFilePath), false);
        
        // ファイルを作成
        fileManager.createFile(testFilePath, content);
        
        // ファイルが存在することを確認
        assert.strictEqual(fileManager.fileExists(testFilePath), true);
        
        // ファイルの内容を確認
        const fileContent = fs.readFileSync(testFilePath, 'utf8');
        assert.strictEqual(fileContent, content);
    });
});
