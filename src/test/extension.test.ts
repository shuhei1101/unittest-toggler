import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { SettingsManager } from '../settings';
import { PathConverter } from '../pathConverter';
import { FileManager } from '../fileManager';

suite('UnitTest Toggler Extension Tests', () => {
	vscode.window.showInformationMessage('テストを開始します');

	// SettingsManagerのテスト
	suite('SettingsManager Tests', () => {
		test('デフォルト設定値の取得', () => {
			const settingsManager = new SettingsManager();
			
			// 各設定のデフォルト値をテスト
			assert.strictEqual(settingsManager.getSourceDirectory(), 'src');
			assert.strictEqual(settingsManager.getTestDirectory(), 'tests');
			assert.strictEqual(settingsManager.getTestFileAffix(), 'test_');
			assert.strictEqual(settingsManager.isPrefix(), true);
		});
	});

	// PathConverterのテスト
	suite('PathConverter Tests', () => {
		const settingsManager = new SettingsManager();
		const pathConverter = new PathConverter(settingsManager);

		test('テストファイルの判定 - 接頭辞', () => {
			// 接頭辞パターンのテスト
			assert.strictEqual(pathConverter.isTestFile('/path/to/test_file.py'), true);
			assert.strictEqual(pathConverter.isTestFile('/path/to/file.py'), false);
		});

		// 他のテストも追加可能
	});

	// FileManagerのテスト
	suite('FileManager Tests', () => {
		const fileManager = new FileManager(new SettingsManager());

		test('ディレクトリ存在確認', () => {
			// 存在するディレクトリのテスト
			assert.strictEqual(fileManager.directoryExists(path.dirname(__filename)), true);
			
			// 存在しないディレクトリのテスト
			assert.strictEqual(fileManager.directoryExists('/non/existent/dir'), false);
		});
	});

	// コマンド登録のテスト
	test('コマンドの登録', async () => {
		// コマンドが登録されていることを確認
		const commands = await vscode.commands.getCommands();
		
		assert.strictEqual(commands.includes('unittest-toggler.toggleUnitTest'), true);
		assert.strictEqual(commands.includes('unittest-toggler.generateUnitTest'), true);
	});
});
