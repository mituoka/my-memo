// 共通の型定義

export interface Tag {
  readonly id: number;
  readonly name: string;
}

export type MemoType = 'memo' | 'note' | 'wiki';

export interface Memo {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly images?: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly isPinned?: boolean;
  readonly type?: MemoType;
}

// API用のMemo型（後方互換性のため保持）
export interface ApiMemo {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly Tag[];
  readonly created_at: string;
  readonly updated_at: string;
}

// API用の型定義
export interface MemoCreate {
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly images?: readonly string[];
  readonly type?: MemoType;
}

export interface MemoUpdate {
  readonly title?: string;
  readonly content?: string;
  readonly tags?: readonly string[];
  readonly images?: readonly string[];
  readonly type?: MemoType;
}

// コンポーネントのプロパティ型
export interface MemoListProps {
  readonly selectedTag?: string;
}

export interface TagCloudProps {
  readonly selectedTag?: string;
  readonly onClearTag?: () => void;
}



// API応答の型
export interface ApiResponse<T> {
  readonly data?: T;
  readonly error?: string;
  readonly loading: boolean;
}

// エラーハンドリング用の型
export interface ApiError {
  readonly message: string;
  readonly status?: number;
}

// ソート関連の型
export type SortField = 'createdAt' | 'updatedAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface SortSettings {
  readonly field: SortField;
  readonly order: SortOrder;
}

// 表示形式関連の型
export type ViewMode = 'grid-2' | 'grid-3' | 'list';

export interface ViewSettings {
  readonly mode: ViewMode;
}

// カードレイアウト関連の型
export type CardLayout = 'default' | 'compact' | 'detailed' | 'minimal';

export interface CardLayoutSettings {
  readonly layout: CardLayout;
}
