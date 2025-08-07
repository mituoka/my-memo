# FlexNote (フレックスノート) - フロントエンド

Next.js 15を使用したモダンで柔軟なメモアプリのフロントエンドです。React 19とTailwind CSS 4を採用し、テーマのカスタマイズ機能や背景画像設定などの豊富な機能を提供する、自由度の高いノートアプリです。

## 🚀 主な機能

- **メモ管理**: メモの作成、編集、削除、一覧表示
- **タグ機能**: メモにタグを付けて分類・検索
- **テーマシステム**: ライト/ダーク/カスタムテーマ対応
- **カスタマイズ**: カラー設定、背景画像、透明度、ぼかし効果
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応
- **リアルタイム検索**: メモのタイトルと内容を瞬時に検索

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **ライブラリ**: React 19, React DOM 19
- **スタイリング**: Tailwind CSS 4
- **型安全性**: TypeScript 5
- **開発ツール**: ESLint 9
- **フォント**: Geist Sans, Geist Mono

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── client-layout.tsx  # クライアントサイドレイアウト
│   ├── globals.css        # グローバルスタイル
│   └── memo/              # メモ関連ページ
│       ├── new/           # 新規メモ作成
│       ├── [id]/          # メモ詳細
│       └── edit/[id]/     # メモ編集
├── components/            # 再利用可能コンポーネント
│   ├── MemoList.tsx       # メモ一覧
│   ├── MemoDetail.tsx     # メモ詳細表示
│   ├── MemoEditor.tsx     # メモ編集コンポーネント
│   ├── MemoForm.tsx       # メモフォーム
│   ├── TagCloud.tsx       # タグクラウド
│   ├── SettingsSidebar.tsx # 設定サイドバー
│   ├── ThemeScript.tsx    # テーマ初期化スクリプト
│   └── ErrorBoundary.tsx  # エラーハンドリング
├── context/               # React Context
│   └── ThemeContext.tsx   # テーマ管理
├── hooks/                 # カスタムフック
│   └── useMemoApi.ts      # API通信フック
└── types/                 # TypeScript型定義
    └── index.ts           # 共通型定義
```

## 🎨 テーマシステム

### サポートするテーマ
- **ライトテーマ**: 明るい背景色
- **ダークテーマ**: 暗い背景色  
- **カスタムテーマ**: ユーザー定義カラー

### カスタマイズ機能
- プライマリカラー設定
- セカンダリカラー設定
- アクセントカラー設定
- 背景画像アップロード
- 透明度調整
- ぼかし効果

## 🔧 セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 環境変数

`.env.local`ファイルを作成し、以下の設定を追加してください：

```env
# バックエンドAPI URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🖥️ 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# 型チェック・Lint
npm run lint

# キャッシュクリア
npm run clean
```

### 開発サーバー

開発サーバーは `http://localhost:3000` で起動します。ファイルを編集すると自動的にページが更新されます。

## 📱 レスポンシブデザイン

- **デスクトップ**: 1024px以上
- **タブレット**: 768px - 1023px
- **モバイル**: 767px以下

## 🎯 主要コンポーネント

### MemoList
- メモの一覧表示
- 検索機能
- タグフィルタリング
- ページネーション

### MemoEditor
- メモの作成・編集
- タグ管理
- フォームバリデーション
- 自動保存

### SettingsSidebar
- テーマ選択
- カラーカスタマイズ
- 背景設定
- アプリ情報

### ThemeContext
- テーマ状態管理
- LocalStorage連携
- CSS変数管理
- ハイドレーション対応

## 🔍 API通信

### useMemoApi Hook
- メモのCRUD操作
- タグ管理
- エラーハンドリング
- ローディング状態管理

### エンドポイント
- `GET /memos` - メモ一覧取得
- `GET /memos/:id` - メモ詳細取得
- `POST /memos` - メモ作成
- `PUT /memos/:id` - メモ更新
- `DELETE /memos/:id` - メモ削除
- `GET /tags` - タグ一覧取得

## 🚀 デプロイ

### Vercel
```bash
npm run build
# Vercelにデプロイ
```

### Docker
```bash
# イメージビルド
docker build -t flexnote-frontend .

# コンテナ起動
docker run -p 3000:3000 flexnote-frontend
```

## 🤝 貢献

1. フォークしてください
2. フィーチャーブランチを作成してください (`git checkout -b feature/AmazingFeature`)
3. 変更をコミットしてください (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュしてください (`git push origin feature/AmazingFeature`)
5. プルリクエストを開いてください

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は `LICENSE` ファイルを参照してください。

## 📞 サポート

問題が発生した場合は、以下の方法でサポートを受けることができます：

- GitHub Issues で問題を報告
- 開発チームへの連絡

## 🔄 更新履歴

### v1.0.0 (最新)
- 初回リリース
- メモ管理機能
- テーマシステム
- カスタマイズ機能
- レスポンシブデザイン

---

Built with ❤️ using Next.js and React