# 貢献ガイド

My Memo Appへの貢献に興味を持っていただき、ありがとうございます！このドキュメントは、プロジェクトに貢献する際のガイドラインを説明しています。

## 🚀 はじめに

### 前提条件
- Node.js 16以上
- npm または yarn
- Git の基本的な知識
- React・TypeScript の基本的な知識

### 開発環境のセットアップ

1. **リポジトリのフォーク**
   - GitHubでこのリポジトリをフォークしてください

2. **ローカル環境の構築**
   ```bash
   # フォークしたリポジトリをクローン
   git clone https://github.com/YOUR_USERNAME/my-memo.git
   cd my-memo
   
   # 依存関係のインストール
   npm install
   
   # 開発サーバーの起動
   npm start
   ```

3. **動作確認**
   - ブラウザで http://localhost:3000 にアクセス
   - メモの作成・編集・削除が正常に動作することを確認

## 📋 貢献の種類

### バグ報告
- Issueを作成して詳細を報告してください
- 再現手順、期待される動作、実際の動作を記載
- スクリーンショットがあると理解しやすくなります

### 機能提案
- まずDiscussionで提案を共有してください
- 必要性と実装方法について議論しましょう
- 承認後にIssueを作成して開発を開始

### コード貢献
- バグ修正
- 新機能の実装
- パフォーマンス改善
- ドキュメント更新

## 🔧 開発フロー

### ブランチ戦略
```bash
# 最新のmainブランチから作業ブランチを作成
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# または
git checkout -b fix/bug-description
git checkout -b docs/update-readme
```

### ブランチ命名規則
- `feature/機能名`: 新機能追加
- `fix/修正内容`: バグ修正
- `docs/更新内容`: ドキュメント更新
- `refactor/改善内容`: リファクタリング
- `test/テスト内容`: テスト追加・修正

### コミットメッセージ
```bash
# 良い例
git commit -m "feat: 画像自動圧縮機能を追加"
git commit -m "fix: タグ削除時のエラーを修正"
git commit -m "docs: READMEの環境構築手順を更新"

# プレフィックス
feat: 新機能
fix: バグ修正
docs: ドキュメント
refactor: リファクタリング
test: テスト
style: スタイル・フォーマット
```

## 🎯 コーディング規約

### TypeScript
- 厳密な型定義を使用する
- `any`型の使用は避ける
- インターfaces使用時は`readonly`を適切に付与

```typescript
// 良い例
interface MemoProps {
  readonly id: string;
  readonly title: string;
  readonly content: string;
}

// 悪い例
interface MemoProps {
  id: any;
  title: string;
}
```

### React Component
- 関数コンポーネントを使用
- propsは分割代入で受け取る
- カスタムフックを積極的に活用

```tsx
// 良い例
interface Props {
  readonly memo: Memo;
  readonly onEdit: (id: string) => void;
}

const MemoCard: React.FC<Props> = ({ memo, onEdit }) => {
  const { title, content } = memo;
  
  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default MemoCard;
```

### ファイル構成
- コンポーネントは`components/`配下に配置
- カスタムフックは`hooks/`配下に配置
- ユーティリティ関数は`utils/`配下に配置
- 型定義は`types/`配下に配置

### CSS・スタイリング
- CSSカスタムプロパティ（CSS変数）を使用
- レスポンシブデザインを考慮
- アクセシビリティに配慮したスタイリング

## ✅ プルリクエスト

### 作成前のチェックリスト
- [ ] コードが正常にビルドされる（`npm run build`）
- [ ] ESLintエラーがない
- [ ] 新機能にはテストが含まれている（該当する場合）
- [ ] ドキュメントが更新されている（該当する場合）
- [ ] 既存機能が正常に動作する

### プルリクエストのテンプレート

```markdown
## 概要
この変更の概要を簡潔に説明してください。

## 変更内容
- [ ] 新機能追加
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント更新
- [ ] その他：

## 実装詳細
具体的な実装内容や設計判断について説明してください。

## テスト
テストした内容や手順を記載してください。

## スクリーンショット（該当する場合）
UIの変更がある場合は、Before/Afterのスクリーンショットを添付してください。

## 関連Issue
関連するIssue番号を記載してください（例：Closes #123）
```

## 🧪 テスト

### 手動テスト
新機能やバグ修正の場合は、以下を確認してください：

1. **基本機能**
   - メモの作成・編集・削除
   - タグの追加・削除
   - 検索機能

2. **画像機能**
   - 画像の添付・削除
   - 大きなファイルの自動圧縮

3. **レスポンシブ**
   - デスクトップ・タブレット・モバイル表示

4. **ブラウザ互換性**
   - Chrome・Firefox・Safari・Edge

### 自動テスト
```bash
# テスト実行
npm test

# カバレッジ確認
npm test -- --coverage
```

## 📞 サポート

### 質問・相談
- Discussionで気軽に質問してください
- Slackやチャットがある場合は、そちらも利用できます

### レビュープロセス
1. プルリクエストを作成
2. 自動チェック（ビルド・Lint）の完了を確認
3. コードレビューの実施
4. フィードバックへの対応
5. 承認後にマージ

## 🎉 貢献者の承認

すべての貢献者は[Contributors](https://github.com/your-username/my-memo/contributors)ページに記載されます。初回の貢献時には、READMEのCreditsセクションにも追加されます。

---

ご質問や不明な点がございましたら、お気軽にIssueやDiscussionでお聞きください。皆様の貢献をお待ちしています！