import { useEffect, useState } from 'react';
import { Memo } from '../types';

const STORAGE_KEY = 'my_memo_app_data';

export const useMemoStorage = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedMemos = localStorage.getItem(STORAGE_KEY);
      if (savedMemos) {
        const parsedMemos = JSON.parse(savedMemos);
        const memosWithImages = parsedMemos.map((memo: any) => ({
          ...memo,
          images: memo.images || [],
          isPinned: memo.isPinned || false
        }));
        setMemos(memosWithImages);
      }
    } catch (e) {
      console.error('Failed to load memos from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveMemos = (updatedMemos: Memo[]) => {
    setMemos(updatedMemos);
    
    if (typeof window !== 'undefined') {
      try {
        const jsonString = JSON.stringify(updatedMemos);
        
        if (jsonString.length > 4 * 1024 * 1024) {
          console.warn('⚠️ ローカルストレージの使用量が4MBを超えています。容量不足の可能性があります。');
        }
        
        localStorage.setItem(STORAGE_KEY, jsonString);
      } catch (error) {
        console.error('localStorage保存エラー:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          alert('画像のサイズが大きすぎるため、保存できませんでした。画像のサイズを小さくするか、枚数を減らしてください。');
        }
        throw error;
      }
    }
  };

  const addMemo = (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMemo: Memo = {
      ...memo,
      id: `memo_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      images: memo.images || [],
      isPinned: false,
    };
    
    const updatedMemos = [...memos, newMemo];
    saveMemos(updatedMemos);
    return newMemo;
  };

  const updateMemo = (id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>) => {
    const targetMemo = memos.find(memo => memo.id === id);
    if (!targetMemo) {
      console.error('対象のメモが見つかりません:', id);
      return;
    }
    
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

  const deleteMemo = (id: string) => {
    const updatedMemos = memos.filter(memo => memo.id !== id);
    saveMemos(updatedMemos);
  };

  const getMemo = (id: string) => {
    return memos.find(memo => memo.id === id);
  };

  const getAllTags = () => {
    const tagsSet = new Set<string>();
    memos.forEach(memo => {
      memo.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

  const importMemos = (importedMemos: Memo[], replaceAll: boolean = false) => {
    let updatedMemos: Memo[];
    
    if (replaceAll) {
      updatedMemos = importedMemos;
    } else {
      const existingIds = new Set(memos.map(memo => memo.id));
      const newMemos = importedMemos.filter(memo => !existingIds.has(memo.id));
      updatedMemos = [...memos, ...newMemos];
    }
    
    saveMemos(updatedMemos);
    return updatedMemos.length - memos.length;
  };

  const clearAllMemos = () => {
    saveMemos([]);
  };

  const togglePinMemo = (id: string) => {
    const updatedMemos = memos.map(memo => {
      if (memo.id === id) {
        return {
          ...memo,
          isPinned: !memo.isPinned,
          updatedAt: new Date().toISOString()
        };
      }
      return memo;
    });
    saveMemos(updatedMemos);
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
    clearAllMemos,
    togglePinMemo
  };
};
