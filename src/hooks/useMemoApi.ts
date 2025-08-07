// APIとの通信を行うカスタムフック
import { useState, useEffect, useCallback } from 'react';
import type { Memo, MemoCreate, MemoUpdate, ApiError } from '@/types';

// APIのベースURL（環境変数から取得または開発環境のデフォルト値）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// エラーハンドリング用のユーティリティ関数
const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: '不明なエラーが発生しました' };
};

// 共通のfetch関数
const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`エラー: ${response.status}`);
  }

  return response.json();
};

// メモ一覧取得用フック
export const useMemos = (tag?: string) => {
  const [memos, setMemos] = useState<readonly Memo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchMemos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = tag 
        ? `/memos?tag=${encodeURIComponent(tag)}` 
        : '/memos';
      
      const data = await apiFetch<Memo[]>(url);
      setMemos(data);
    } catch (err) {
      console.error('メモの取得中にエラーが発生しました:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [tag]);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  return { memos, loading, error, refetch: fetchMemos } as const;
};

// メモ詳細取得用フック
export const useMemo = (id: number) => {
  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchMemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Memo>(`/memos/${id}`);
      setMemo(data);
    } catch (err) {
      console.error('メモの取得中にエラーが発生しました:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMemo();
  }, [fetchMemo]);

  return { memo, loading, error, refetch: fetchMemo } as const;
};

// メモ作成用フック
export const useCreateMemo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [createdMemo, setCreatedMemo] = useState<Memo | null>(null);

  const createMemo = useCallback(async (memoData: MemoCreate): Promise<Memo | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Memo>('/memos', {
        method: 'POST',
        body: JSON.stringify(memoData),
      });
      
      setCreatedMemo(data);
      return data;
    } catch (err) {
      console.error('メモの作成中にエラーが発生しました:', err);
      setError(handleApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createMemo, loading, error, createdMemo } as const;
};

// メモ更新用フック
export const useUpdateMemo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [updatedMemo, setUpdatedMemo] = useState<Memo | null>(null);

  const updateMemo = useCallback(async (id: number, memoData: MemoUpdate): Promise<Memo | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Memo>(`/memos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(memoData),
      });
      
      setUpdatedMemo(data);
      return data;
    } catch (err) {
      console.error('メモの更新中にエラーが発生しました:', err);
      setError(handleApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateMemo, loading, error, updatedMemo } as const;
};

// メモ削除用フック
export const useDeleteMemo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteMemo = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await apiFetch(`/memos/${id}`, {
        method: 'DELETE',
      });
      
      setSuccess(true);
      return true;
    } catch (err) {
      console.error('メモの削除中にエラーが発生しました:', err);
      setError(handleApiError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteMemo, loading, error, success } as const;
};

// タグ一覧取得用フック
export const useTags = () => {
  const [tags, setTags] = useState<readonly { id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ id: number; name: string }[]>('/tags');
      setTags(data);
    } catch (err) {
      console.error('タグの取得中にエラーが発生しました:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, loading, error, refetch: fetchTags } as const;
};
