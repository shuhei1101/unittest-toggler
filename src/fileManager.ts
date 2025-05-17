// ファイル操作機能の実装
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { SettingsManager, OpenLocationOption } from './settings';

/**
 * ファイル操作を担当するクラス
 */
export class FileManager {
    private settingsManager: SettingsManager;

    constructor(settingsManager: SettingsManager) {
        this.settingsManager = settingsManager;
    }
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
            // 1. まず visibleTextEditors で探す (グループ情報つきで見えているファイル)
            const visibleEditors = vscode.window.visibleTextEditors;
            for (const editor of visibleEditors) {
                if (editor.document.uri.fsPath === filePath) {
                    // 既に表示されているエディタをアクティブにする (グループ情報を維持)
                    return await vscode.window.showTextDocument(editor.document, {
                        viewColumn: editor.viewColumn,
                        preserveFocus: false // フォーカスを強制的に移す
                    });
                }
            }
            
            // // 2. 次に workspace.textDocuments で探す (開かれているが非表示のファイル)
            // const openedDocuments = vscode.workspace.textDocuments;
            // for (const document of openedDocuments) {
            //     if (document.uri.fsPath === filePath) {
            //         // 既に開かれているドキュメントをアクティブにする
            //         return await vscode.window.showTextDocument(document, {
            //             preserveFocus: false // フォーカスを強制的に移す
            //         });
            //     }
            // }

            // ファイルが存在しない場合は空のファイルを作成
            // createFile メソッドでは自動的にディレクトリも作成される
            if (!this.fileExists(filePath)) {
                // ファイルの親ディレクトリを作成
                const dirPath = path.dirname(filePath);
                this.createDirectory(dirPath);
                
                // ファイルを作成
                this.createFile(filePath);
            }
            
            // ファイルをVSCodeで開く
            const document = await vscode.workspace.openTextDocument(filePath);
            
            // 設定に基づいて適切なViewColumnを決定
            const viewColumn = this.determineViewColumn();
            console.log(`[unittest-toggler] ファイル新規表示時のviewColumn: ${viewColumn}`);
            
            // 明示的なViewColumnオプションを使用
            return await vscode.window.showTextDocument(document, {
                viewColumn,
                preserveFocus: false
            });
        } catch (error) {
            console.error(`ファイルを開けませんでした: ${filePath}`, error);
            vscode.window.showErrorMessage(`ファイルを開けませんでした: ${filePath}`);
            return undefined;
        }
    }    /**
     * 新規ファイルを開く際のViewColumnを決定する
     * @returns 適切なViewColumn
     */
    private determineViewColumn(): vscode.ViewColumn {
        const openLocation = this.settingsManager.getOpenLocation();
        const activeEditor = vscode.window.activeTextEditor;
        const activeViewColumn = activeEditor?.viewColumn || vscode.ViewColumn.One;
        
        console.log(`[unittest-toggler] 使用する設定値(enum): ${openLocation}, 種類: ${typeof openLocation}, 現在のViewColumn: ${activeViewColumn}`);
        
        // 設定の文字列値を直接取得して確認
        const rawValue = this.settingsManager.get<string>('openLocation', 'activeGroup');
        console.log(`[unittest-toggler] 生の設定値(string): ${rawValue}, 種類: ${typeof rawValue}`);
        
        switch (openLocation) {
            case OpenLocationOption.ActiveGroup:
                // 現在のグループで開く
                return activeViewColumn;
                
            case OpenLocationOption.OtherGroup:
                // もう一方のグループで開く（2つしかない場合）
                const visibleEditors = vscode.window.visibleTextEditors;
                const otherEditors = visibleEditors.filter(editor => 
                    editor.viewColumn !== activeViewColumn && 
                    editor.viewColumn !== vscode.ViewColumn.Active);
                
                // 他のグループが存在する場合はその最初のものを使用、なければ隣に開く
                if (otherEditors.length > 0 && otherEditors[0].viewColumn !== undefined) {
                    return otherEditors[0].viewColumn;
                }
                return vscode.ViewColumn.Beside;
                    
            case OpenLocationOption.VerticalGroup:
                // 縦方向のグループで開く（上下関係）
                // 表示されているエディタのビューカラムを取得
                const allColumns = vscode.window.visibleTextEditors
                    .map(editor => editor.viewColumn)
                    .filter((column): column is vscode.ViewColumn => column !== undefined)
                    .filter(column => column !== vscode.ViewColumn.Active);
                    
                // 重複を削除してソート
                const uniqueColumns = [...new Set(allColumns)].sort();
                
                if (uniqueColumns.length <= 1) {
                    // グループが1つしかない場合は新しいグループを作成
                    return vscode.ViewColumn.Beside;
                }
                
                // 現在のグループのインデックスを見つける
                let currentIndex = -1;
                for (let i = 0; i < uniqueColumns.length; i++) {
                    if (uniqueColumns[i] === activeViewColumn) {
                        currentIndex = i;
                        break;
                    }
                }
                
                if (currentIndex === -1) {
                    // 現在のグループが見つからない場合は新しいグループを作成
                    return vscode.ViewColumn.Beside;
                }
                
                // 次のグループ（上方向巻き戻し）
                const nextIndex = (currentIndex - 1 + uniqueColumns.length) % uniqueColumns.length;
                return uniqueColumns[nextIndex];
                
            case OpenLocationOption.HorizontalGroup:
                // 横方向のグループで開く（左右関係）
                // 表示されているエディタのビューカラムを取得
                const allHorizColumns = vscode.window.visibleTextEditors
                    .map(editor => editor.viewColumn)
                    .filter((column): column is vscode.ViewColumn => column !== undefined)
                    .filter(column => column !== vscode.ViewColumn.Active);
                    
                // 重複を削除してソート
                const uniqueHorizColumns = [...new Set(allHorizColumns)].sort();
                
                if (uniqueHorizColumns.length <= 1) {
                    // グループが1つしかない場合は新しいグループを作成
                    return vscode.ViewColumn.Beside;
                }
                
                // 現在のグループのインデックスを見つける
                let currentHorizIndex = -1;
                for (let i = 0; i < uniqueHorizColumns.length; i++) {
                    if (uniqueHorizColumns[i] === activeViewColumn) {
                        currentHorizIndex = i;
                        break;
                    }
                }
                
                if (currentHorizIndex === -1) {
                    // 現在のグループが見つからない場合は新しいグループを作成
                    return vscode.ViewColumn.Beside;
                }
                
                // 次のグループ（右方向巻き戻し）
                const nextHorizIndex = (currentHorizIndex + 1) % uniqueHorizColumns.length;
                return uniqueHorizColumns[nextHorizIndex];
                
            default:
                // デフォルトは現在のグループ
                return activeViewColumn;
        }
    }
}
