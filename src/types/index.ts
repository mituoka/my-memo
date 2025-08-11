// 共通の型定義

export interface Tag {
  readonly id: number;
  readonly name: string;
}

export interface Memo {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly images?: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
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
}

export interface MemoUpdate {
  readonly title?: string;
  readonly content?: string;
  readonly tags?: readonly string[];
  readonly images?: readonly string[];
}

// コンポーネントのプロパティ型
export interface MemoListProps {
  readonly selectedTag?: string;
}

export interface TagCloudProps {
  readonly selectedTag?: string;
  readonly onClearTag?: () => void;
}

export interface MemoEditorProps {
  readonly memo?: Memo;
  readonly mode: 'create' | 'edit';
}

// フォームの状態型
export interface MemoFormState {
  readonly title: string;
  readonly content: string;
  readonly tagInput: string;
  readonly tags: readonly string[];
  readonly images: readonly string[];
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
