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
        const parsedMemos = JSON.parse(savedMemos);
        console.log('ローカルストレージから読み込んだメモ:', parsedMemos);
        // 既存メモでimagesプロパティがない場合は空配列を設定
        const memosWithImages = parsedMemos.map((memo: any) => ({
          ...memo,
          images: memo.images || []
        }));
        console.log('画像プロパティを追加したメモ:', memosWithImages);
        setMemos(memosWithImages);
      }
    } catch (e) {
      console.error('Failed to load memos from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // メモを保存する関数
  const saveMemos = (updatedMemos: Memo[]) => {
    console.log('=== saveMemos開始 ===');
    console.log('保存するメモの数:', updatedMemos.length);
    console.log('保存するメモの画像データ:', updatedMemos.map(memo => ({
      id: memo.id,
      title: memo.title,
      imagesCount: memo.images?.length || 0
    })));
    
    setMemos(updatedMemos);
    
    if (typeof window !== 'undefined') {
      try {
        const jsonString = JSON.stringify(updatedMemos);
        const sizeInMB = (jsonString.length / 1024 / 1024).toFixed(2);
        console.log('localStorage保存前のデータサイズ:', `${sizeInMB}MB`);
        
        // 5MBに近づいている場合は警告
        if (jsonString.length > 4 * 1024 * 1024) { // 4MB
          console.warn('⚠️ ローカルストレージの使用量が4MBを超えています。容量不足の可能性があります。');
        }
        
        localStorage.setItem(STORAGE_KEY, jsonString);
        
        // 保存確認
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('localStorage保存後確認:', parsed.map((memo: any) => ({
            id: memo.id,
            title: memo.title,
            imagesCount: memo.images?.length || 0
          })));
        }
      } catch (error) {
        console.error('localStorage保存エラー:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          alert('画像のサイズが大きすぎるため、保存できませんでした。画像のサイズを小さくするか、枚数を減らしてください。');
        }
        throw error;
      }
    }
    
    console.log('=== saveMemos完了 ===');
  };

  // メモを追加
  const addMemo = (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('addMemo受信データ:', memo);
    const now = new Date().toISOString();
    const newMemo: Memo = {
      ...memo,
      id: `memo_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      images: memo.images || [],
    };
    console.log('作成されるメモ:', newMemo);
    
    const updatedMemos = [...memos, newMemo];
    saveMemos(updatedMemos);
    console.log('保存後のメモ一覧:', updatedMemos);
    return newMemo;
  };

  // メモを更新
  const updateMemo = (id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>) => {
    console.log('=== updateMemo開始 ===');
    console.log('updateMemo受信データ:', { id, updates });
    console.log('受信した画像データ:', updates.images?.length || 0, '枚');
    
    const targetMemo = memos.find(memo => memo.id === id);
    if (!targetMemo) {
      console.error('対象のメモが見つかりません:', id);
      return;
    }
    
    const updatedMemos = memos.map(memo => {
      if (memo.id === id) {
        const updatedMemo = { 
          ...memo, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        console.log('更新前メモ:', {
          ...memo,
          images: memo.images?.length || 0
        });
        console.log('更新後メモ:', {
          ...updatedMemo,
          images: updatedMemo.images?.length || 0
        });
        console.log('更新後の実際の画像データ:', updatedMemo.images);
        return updatedMemo;
      }
      return memo;
    });
    
    console.log('saveMemos実行前');
    saveMemos(updatedMemos);
    console.log('saveMemos実行後');
    console.log('=== updateMemo完了 ===');
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
