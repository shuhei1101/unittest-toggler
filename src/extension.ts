import * as vscode from 'vscode';
import { SettingsManager } from './settings';
import { PathConverter } from './pathConverter';
import { FileManager } from './fileManager';
import { CommandHandler } from './commandHandler';

export function activate(context: vscode.ExtensionContext) {
	console.log('拡張機能 "unittest-toggler" が有効化されました');

	// コンポーネントのインスタンス化
	const settingsManager = new SettingsManager();
	const pathConverter = new PathConverter(settingsManager);
	const fileManager = new FileManager();
	const commandHandler = new CommandHandler(settingsManager, pathConverter, fileManager);

	// コマンドの登録
	const toggleCommand = vscode.commands.registerCommand(
		'unittest-toggler.toggleUnitTest',
		() => commandHandler.toggleUnitTest()
	);

	const generateCommand = vscode.commands.registerCommand(
		'unittest-toggler.generateUnitTest',
		(uri: vscode.Uri, uris: vscode.Uri[]) => {
			// 単一選択の場合とマルチ選択の場合の両方をサポート
			const filesToProcess = uris && uris.length > 0 ? uris : [uri];
			commandHandler.generateUnitTest(filesToProcess);
		}
	);

	// コマンドを登録
	context.subscriptions.push(toggleCommand);
	context.subscriptions.push(generateCommand);
}

export function deactivate() {}
