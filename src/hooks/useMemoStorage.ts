import { useEffect, useState } from 'react';
import { Memo } from '../types';

const STORAGE_KEY = 'my_memo_app_data';

export const useMemoStorage = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ローカルストレージからメモを読み込む
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedMemos = localStorage.getItem(STORAGE_KEY);
      if (savedMemos) {
        setMemos(JSON.parse(savedMemos));
      }
    } catch (e) {
      console.error('Failed to load memos from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // メモを保存する関数
  const saveMemos = (updatedMemos: Memo[]) => {
    setMemos(updatedMemos);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemos));
    }
  };

  // メモを追加
  const addMemo = (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMemo: Memo = {
      ...memo,
      id: `memo_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      images: memo.images || [],
    };
    
    const updatedMemos = [...memos, newMemo];
    saveMemos(updatedMemos);
    return newMemo;
  };

  // メモを更新
  const updateMemo = (id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>) => {
    const updatedMemos = memos.map(memo => {
      if (memo.id === id) {
        return { 
          ...memo, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
      }
      return memo;
    });
    
    saveMemos(updatedMemos);
  };

  // メモを削除
  const deleteMemo = (id: string) => {
    const updatedMemos = memos.filter(memo => memo.id !== id);
    saveMemos(updatedMemos);
  };

  // メモを取得
  const getMemo = (id: string) => {
    return memos.find(memo => memo.id === id);
  };

  // 全てのタグを取得
  const getAllTags = () => {
    const tagsSet = new Set<string>();
    memos.forEach(memo => {
      memo.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

  // バックアップから復元
  const importMemos = (importedMemos: Memo[], replaceAll: boolean = false) => {
    let updatedMemos: Memo[];
    
    if (replaceAll) {
      // 全て置き換え
      updatedMemos = importedMemos;
    } else {
      // 既存データとマージ（IDが重複する場合は既存データを優先）
      const existingIds = new Set(memos.map(memo => memo.id));
      const newMemos = importedMemos.filter(memo => !existingIds.has(memo.id));
      updatedMemos = [...memos, ...newMemos];
    }
    
    saveMemos(updatedMemos);
    return updatedMemos.length - memos.length; // 追加されたメモの数
  };

  // 全メモを削除
  const clearAllMemos = () => {
    saveMemos([]);
  };

  return {
    memos,
    isLoaded,
    addMemo,
    updateMemo,
    deleteMemo,
    getMemo,
    getAllTags,
    importMemos,
    clearAllMemos
  };
};
