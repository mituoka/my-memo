# My Memo App

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React%20Router-6.8.0-red.svg)](https://reactrouter.com/)
[![DOMPurify](https://img.shields.io/badge/DOMPurify-3.2.6-green.svg)](https://github.com/cure53/DOMPurify)

モダンで使いやすいメモ管理アプリケーションです。React 18とTypeScriptを使用して構築されており、画像添付、タグ管理、テーマカスタマイズなどの豊富な機能を提供します。

## 🚀 主な機能

- **メモ管理**: 作成、編集、削除、検索機能
- **画像添付**: 自動圧縮機能付きの画像アップロード
- **タグシステム**: メモの分類・検索用タグ管理
- **テーマ対応**: ライト・ダークテーマ切り替え
- **表示カスタマイズ**: グリッド表示（2列・3列）、リスト表示
- **キーボードショートカット**: 効率的な操作支援
- **PWA対応**: オフライン機能とアプリインストール
- **レスポンシブデザイン**: 全デバイス対応

## 🛠️ 技術スタック

- **フレームワーク**: React 18.2.0
- **言語**: TypeScript 4.9.5
- **ルーティング**: React Router 6.8.0
- **ビルドツール**: Create React App 5.0.1
- **セキュリティ**: DOMPurify 3.2.6
- **PWA**: Service Worker対応

## 📁 ディレクトリ構成

```
src/
├── components/              # 再利用可能コンポーネント
│   ├── common/             # 基本コンポーネント
│   │   ├── Button.tsx      # ボタンコンポーネント
│   │   ├── Modal.tsx       # モーダルコンポーネント
│   │   └── SkeletonLoader.tsx # ローディング表示
│   ├── menus/              # メニュー関連
│   │   ├── BackgroundMenu.tsx
│   │   ├── BackupMenu.tsx
│   │   └── FontMenu.tsx
│   ├── modals/             # モーダルダイアログ
│   └── *.tsx              # その他コンポーネント
├── contexts/               # React Context
│   ├── ThemeContext.tsx    # テーマ管理
│   ├── FontContext.tsx     # フォント設定
│   └── BackgroundContext.tsx
├── hooks/                  # カスタムフック
│   ├── useMemoStorage.ts   # メモデータ管理
│   ├── useMemoApi.ts       # API通信
│   ├── useKeyboardShortcuts.ts # ショートカット
│   └── *.ts               # その他フック
├── pages/                  # ページコンポーネント
│   ├── Home.tsx           # ホーム画面
│   ├── NewMemo.tsx        # 新規メモ作成
│   ├── EditMemo.tsx       # メモ編集
│   └── MemoDetail.tsx     # メモ詳細
├── types/                  # TypeScript型定義
│   └── index.ts           # 共通型定義
├── utils/                  # ユーティリティ関数
│   ├── markdownUtils.ts   # Markdown処理
│   ├── templates.ts       # テンプレート管理
│   └── timeUtils.ts       # 時間関連処理
└── styles/                # スタイル定義
    └── components.css     # コンポーネントスタイル
```

## 🔧 環境構築

### 前提条件

- Node.js 16以上
- npm または yarn

### インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/your-username/my-memo.git
cd my-memo

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

### 利用可能なコマンド

| コマンド | 説明 |
|----------|------|
| `npm start` | 開発サーバーを起動（localhost:3000） |
| `npm run build` | 本番用ビルドを作成 |
| `npm run test` | テストを実行 |
| `npm run deploy` | GitHub Pagesにデプロイ |

### 環境変数

現在、環境変数の設定は不要です（ローカルストレージを使用）。

## 🎯 主要機能の詳細

### メモ管理
- **作成**: 豊富なテンプレート（メモ・ノート・Wiki形式）
- **編集**: リアルタイムプレビュー機能
- **検索**: タイトル・内容・タグでの高速検索
- **並び替え**: 作成日・更新日・タイトル順

### 画像機能
- **自動圧縮**: サイズ制限を超える画像は自動で圧縮
- **複数添付**: ドラッグ&ドロップ対応
- **プレビュー**: 添付画像の即座確認

### カスタマイズ
- **テーマ**: ライト・ダークテーマ
- **表示形式**: 2列・3列グリッド、リスト表示
- **フォント**: 複数フォント選択
- **背景**: カスタム背景設定

## 🔍 トラブルシューティング

### 画像アップロードエラー
**問題**: 「画像のサイズが大きすぎる」エラーが表示される

**解決策**:
1. 画像は自動的に圧縮されます
2. 画像を削除してエラーをクリアできます
3. 複数の小さな画像に分割してください

### ローカルストレージ容量不足
**問題**: データ保存に失敗する

**解決策**:
1. 不要なメモを削除
2. 画像付きメモを整理
3. ブラウザのキャッシュをクリア

### ビルドエラー
**問題**: TypeScriptエラーが発生する

**解決策**:
```bash
# 型チェックを実行
npx tsc --noEmit

# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

## 🚀 デプロイ

### GitHub Pages
```bash
# 自動デプロイ
npm run deploy
```

### その他のプラットフォーム
```bash
# ビルドファイル作成
npm run build

# buildフォルダの内容をホスティングサービスにアップロード
```

## 🤝 貢献について

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

### 開発ガイドライン
- TypeScriptの型安全性を保つ
- コンポーネントの再利用性を考慮
- アクセシビリティに配慮
- パフォーマンスを意識した実装

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 📞 サポート

- **Issues**: [GitHub Issues](https://github.com/your-username/my-memo/issues)
- **Discussion**: 新機能の提案や質問はDiscussionをご利用ください

## 🔄 更新履歴

### v0.1.0 (現在)
- ✅ 基本的なメモ管理機能
- ✅ 画像添付・自動圧縮機能
- ✅ タグシステム
- ✅ テーマ対応
- ✅ PWA機能
- ✅ TypeScript対応完了

---

Built with ❤️ using React and TypeScript