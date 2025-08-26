# Changelog

このファイルは、このプロジェクトのすべての重要な変更を記録します。

フォーマットは[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/)に基づき、
このプロジェクトは[Semantic Versioning](https://semver.org/lang/ja/)に準拠しています。

## [Unreleased]

## [0.1.0] - 2025-01-XX

### 追加
- ✨ メモ管理機能（作成・編集・削除・検索）
- ✨ 画像添付機能（ドラッグ&ドロップ対応）
- ✨ 画像自動圧縮機能（大容量ファイル対応）
- ✨ タグシステム（分類・検索・管理）
- ✨ テーマシステム（ライト・ダーク）
- ✨ 表示カスタマイズ（2列・3列グリッド、リスト表示）
- ✨ キーボードショートカット機能
- ✨ 高度検索パネル
- ✨ 並び替え機能（作成日・更新日・タイトル）
- ✨ PWA対応（オフライン機能・インストール）
- ✨ レスポンシブデザイン（全デバイス対応）
- ✨ バックアップ・復元機能
- ✨ フォントカスタマイズ機能
- ✨ 背景設定機能
- ✨ メモテンプレート（メモ・ノート・Wiki）

### 修正
- 🐛 TypeScript型エラーの完全修正
- 🐛 Next.jsからReact Routerへの適切な移行
- 🐛 DOMPurify設定の最適化
- 🐛 カスタムテーマ機能の削除（複雑性軽減）
- 🐛 ビルドエラーの解消

### 変更
- 🔄 tsconfig.jsonをCreate React App用に最適化
- 🔄 パスエイリアス（@/*）の設定追加
- 🔄 コンポーネント構造の整理
- 🔄 未使用コードの削除

### セキュリティ
- 🔒 DOMPurifyによるXSS対策の実装
- 🔒 画像処理のセキュリティ強化

## リリースタイプの説明

### 追加 (Added)
新機能の追加

### 変更 (Changed)
既存機能の変更

### 非推奨 (Deprecated)
間もなく削除される機能

### 削除 (Removed)
削除された機能

### 修正 (Fixed)
バグ修正

### セキュリティ (Security)
セキュリティに関する修正

---

[Unreleased]: https://github.com/your-username/my-memo/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-username/my-memo/releases/tag/v0.1.0