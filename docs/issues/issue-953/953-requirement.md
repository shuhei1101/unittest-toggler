<!-- filepath: docs/issues/issue-953/953-requirement.md -->
# Issue953の仕様書

## 1. 目次
- [1. 目次](#1-目次)
- [2. 用語](#2-用語)
- [3. 依頼内容](#3-依頼内容)
- [4. 機能要件/非機能要件](#4-機能要件非機能要件)
  - [4.1. 機能要件](#41-機能要件)
  - [4.2. 非機能要件](#42-非機能要件)
- [5. 使用ツール/ライブラリ](#5-使用ツールライブラリ)
- [6. クラス設計](#6-クラス設計)
  - [6.1. `Xxx`クラス(新規)](#61-xxxクラス新規)
- [7. UML](#7-uml)
- [8. タスク](#8-タスク)
  - [8.1. (補足)本セクションの説明](#81-補足本セクションの説明)

## 2. 用語
- VSCode拡張機能: Visual Studio Codeに機能を追加するプラグイン
- Yeoman: プロジェクトジェネレーター
- yo code: VSCode拡張機能のプロジェクトスキャフォールディング用Yeomanジェネレーター
- VSCE: Visual Studio Code Extension CLI

## 3. 依頼内容
- issue番号: 953
- タイトル: VSCode拡張機能開発用プロジェクトの初期化
- 内容:
  - 開発環境のセットアップ > [953] VSCode拡張機能開発用プロジェクトの初期化 を行ってください。

## 4. 機能要件/非機能要件
### 4.1. 機能要件
- VSCode拡張機能開発用プロジェクトの雛形を生成できること
- TypeScriptによる開発環境を準備できること
- ビルド、デバッグ、パッケージングがVSCode上で行えること
### 4.2. 非機能要件
- セットアップ完了までに5分以内であること
- 設定ファイルは標準的なディレクトリ構成に従うこと
- 必要な依存関係はnpmパッケージとして管理されること

## 5. 使用ツール/ライブラリ
- Node.js (>=14.x)
- npm
- Yeoman (`yo`, `generator-code`)
- TypeScript
- VSCode Extension API (`@types/vscode`)
- ESLint
- Prettier
- VSCE

## 6. クラス設計
### 6.1. `Xxx`クラス(新規)
- 初期化時点ではクラス設計不要 (プロジェクト構造のみ生成)

## 7. UML
- 初期化処理のUML図は不要

## 8. タスク
- [ ] プロジェクト雛形の生成 (1h)
  - [ ] `yo code`コマンドでプロジェクトをスキャフォールド (0.5h)
  - [ ] `package.json`の初期設定確認 (0.2h)
  - [ ] ディレクトリ構成の確認 (0.3h)
- [ ] TypeScript環境の構築 (1h)
  - [ ] `tsconfig.json`の作成 (0.2h)
  - [ ] `src/extension.ts`の初期ファイル作成 (0.3h)
  - [ ] `@types/vscode`インストール (0.2h)
  - [ ] npmスクリプト設定 (build, watch) (0.3h)
- [ ] ビルド・デバッグ設定 (0.5h)
  - [ ] `.vscode/tasks.json`の設定 (0.2h)
  - [ ] `.vscode/launch.json`の設定 (0.3h)
- [ ] Linter・フォーマッタ設定 (0.5h)
  - [ ] ESLint初期設定 (0.2h)
  - [ ] Prettier設定 (0.3h)

### 8.1. (補足)本セクションの説明
- テンプレートを基に内容を記載してください。
