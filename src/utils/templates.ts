import { MemoType } from '../types';

export interface Template {
  id: string;
  name: string;
  type: MemoType;
  content: string;
  description: string;
}

export const templates: Template[] = [
  // ノートテンプレート（事実・解釈・行動ベース）
  {
    id: 'note-basic',
    name: '基本思考整理',
    type: 'note',
    description: '事実・解釈・行動を整理して思考をまとめる',
    content: `# 思考整理ノート

## 📋 事実（Facts）
*客観的な事実、観察したことを記録*

### 何が起こったか


### いつ・どこで


### 誰が関わっていたか


## 🤔 解釈（Interpretation）
*事実に対する分析・考察・仮説*

### なぜそうなったのか


### どういう意味があるか


### パターンや関連性


## ⚡ 行動（Actions）
*解釈に基づいて取るべき行動・次のステップ*

### 今すぐやること
- [ ] 
- [ ] 
- [ ] 

### 今度やること
- [ ] 
- [ ] 
- [ ] 

### 検証すべきこと
- [ ] 
- [ ] 
- [ ] 

---
*記録日時: ${new Date().toLocaleDateString('ja-JP')}*
`
  },
  {
    id: 'note-reflection',
    name: '振り返り・反省',
    type: 'note',
    description: '経験を振り返って学びを整理する',
    content: `# 振り返りノート

## 📋 事実（What happened）
*何があったかを客観的に記録*


## 🤔 解釈（So What）
*その経験から何を学んだか*

### うまくいったこと


### うまくいかなかったこと


### 気づいたこと・発見


## ⚡ 行動（Now What）
*今後どう活かすか*

### 続けること
- 
- 

### 改善すること
- 
- 

### 新しく試すこと
- 
- 

---
*記録日時: ${new Date().toLocaleDateString('ja-JP')}*
`
  },
  {
    id: 'note-decision',
    name: '意思決定',
    type: 'note',
    description: '重要な判断を記録・分析する',
    content: `# 意思決定ノート

## 📋 事実（Situation）
*現在の状況・背景情報*

### 決定が必要な事項


### 制約・前提条件


### 利用可能な選択肢


## 🤔 解釈（Analysis）
*各選択肢の分析*

### 選択肢1: 
**メリット:**
- 

**デメリット:**
- 

### 選択肢2: 
**メリット:**
- 

**デメリット:**
- 

### 判断基準・重視するポイント


## ⚡ 行動（Decision）
*最終的な決定と実行計画*

### 決定事項


### 理由・根拠


### 実行計画
- [ ] 
- [ ] 
- [ ] 

### 振り返り予定日


---
*記録日時: ${new Date().toLocaleDateString('ja-JP')}*
`
  },

  // Wikiテンプレート（単語・概念の詳細記載）
  {
    id: 'wiki-term',
    name: '用語・概念',
    type: 'wiki',
    description: 'わからない単語や概念を詳しく調べて記録',
    content: `# [用語名・概念名]

## 📝 基本定義
*この用語・概念の基本的な意味*


## 🔍 詳細説明
*より詳しい説明・背景*


## 💡 使用例・具体例
### 例1


### 例2


### 例3


## 🔗 関連用語
- **[関連用語1]**: 
- **[関連用語2]**: 
- **[関連用語3]**: 

## 📚 参考情報
- 出典: 
- 参考URL: 
- 参考書籍: 

## 💭 個人的メモ
*自分なりの理解・覚え方*


---
*調べた日: ${new Date().toLocaleDateString('ja-JP')}*
*分野: [技術/ビジネス/学術/その他]*
*理解度: [★☆☆☆☆]*
`
  },
  {
    id: 'wiki-acronym',
    name: '略語・専門用語',
    type: 'wiki',
    description: '略語や専門用語の正式名称と意味を記録',
    content: `# [略語] - [正式名称]

## 📝 正式名称
**[略語]** = [正式名称の英語]


## 🌐 日本語訳


## 🔍 意味・概要


## 💼 使用される分野
- 
- 
- 

## 💡 使用例
### 文脈1


### 文脈2


## 🔄 類似用語・対義語
- **類似**: 
- **対義語**: 
- **上位概念**: 
- **下位概念**: 

## 📊 補足情報
### 歴史・由来


### 注意点・誤解しやすい点


---
*調べた日: ${new Date().toLocaleDateString('ja-JP')}*
*重要度: [高/中/低]*
*覚えた: [はい/いいえ]*
`
  },
  {
    id: 'wiki-concept',
    name: '概念・理論',
    type: 'wiki',
    description: '複雑な概念や理論を詳しく整理',
    content: `# [概念名・理論名]

## 📝 概要
*この概念・理論は何か*


## 🎯 目的・なぜ重要か


## 🏗️ 構成要素・仕組み
### 要素1


### 要素2


### 要素3


## 💡 実例・応用例
### 例1: 
**状況:**
**適用方法:**
**結果:**

### 例2: 
**状況:**
**適用方法:**
**結果:**

## ✅ メリット・利点
- 
- 
- 

## ⚠️ デメリット・制限
- 
- 
- 

## 🔗 関連概念
- **[関連概念1]**: どう関連するか
- **[関連概念2]**: どう関連するか
- **[関連概念3]**: どう関連するか

## 📚 学習リソース
- 
- 
- 

## 💭 自分なりの理解
*この概念をどう理解したか、どう覚えるか*


---
*調べた日: ${new Date().toLocaleDateString('ja-JP')}*
*難易度: [初級/中級/上級]*
*理解度: [★★★☆☆]*
`
  }
];

// タイプ別テンプレートを取得
export const getTemplatesByType = (type: MemoType): Template[] => {
  return templates.filter(template => template.type === type);
};

// テンプレートをIDで取得
export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};