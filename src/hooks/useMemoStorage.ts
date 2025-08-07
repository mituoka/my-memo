'use client';

import { useEffect, useState } from 'react';

export interface Memo {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

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

  return {
    memos,
    isLoaded,
    addMemo,
    updateMemo,
    deleteMemo,
    getMemo,
    getAllTags
  };
};
