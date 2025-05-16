import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { SettingsManager } from '../settings';

suite('SettingsManager Tests', () => {
    let settingsManager: SettingsManager;
    
    setup(() => {
        settingsManager = new SettingsManager();
    });
    
    test('デフォルト設定値の取得', () => {
        assert.strictEqual(settingsManager.getSourceDirectory(), 'src');
        assert.strictEqual(settingsManager.getTestDirectory(), 'tests');
        assert.strictEqual(settingsManager.getTestFileAffix(), 'test_');
        assert.strictEqual(settingsManager.isPrefix(), true);
    });
    
    test('get メソッド - デフォルト値の使用', () => {
        const defaultValue = 'default';
        assert.strictEqual(settingsManager.get('nonExistentKey', defaultValue), defaultValue);
    });
});
