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
          isPinned: memo.isPinned || false,
          type: memo.type || 'memo'
        }));
        setMemos(memosWithImages);
      }
    } catch (e) {
      console.error('Failed to load memos from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 画像サイズを圧縮する関数
  const compressImage = (imageDataUrl: string, maxSizeKB: number = 500): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // アスペクト比を保持しながらサイズを調整
        let { width, height } = img;
        const maxDimension = 1200; // 最大サイズ
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // 品質を調整しながら圧縮
        let quality = 0.8;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 目標サイズに達するまで品質を下げる
        while (compressedDataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) { // base64は約1.37倍になる
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(compressedDataUrl);
      };
      img.src = imageDataUrl;
    });
  };

  // 複数の画像を圧縮する関数
  const compressImages = async (images: readonly string[] | undefined): Promise<string[]> => {
    if (!images || images.length === 0) return [];
    
    const compressedImages: string[] = [];
    for (const image of images) {
      try {
        const compressed = await compressImage(image);
        compressedImages.push(compressed);
      } catch (error) {
        console.warn('画像圧縮に失敗しました:', error);
        compressedImages.push(image); // 圧縮に失敗した場合は元の画像を使用
      }
    }
    return compressedImages;
  };

  const saveMemos = async (updatedMemos: Memo[], autoCompress: boolean = true) => {
    setMemos(updatedMemos);
    
    if (typeof window !== 'undefined') {
      try {
        let memosToSave = updatedMemos;
        
        // 最初に通常の保存を試行
        let jsonString = JSON.stringify(memosToSave);
        
        if (jsonString.length > 4 * 1024 * 1024) {
          console.warn('⚠️ ローカルストレージの使用量が4MBを超えています。容量不足の可能性があります。');
        }
        
        localStorage.setItem(STORAGE_KEY, jsonString);
      } catch (error) {
        console.error('localStorage保存エラー:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError' && autoCompress) {
          try {
            console.log('画像を圧縮して再試行します...');
            
            // 画像を圧縮して再試行
            const compressedMemos = await Promise.all(
              updatedMemos.map(async (memo: Memo) => ({
                ...memo,
                images: await compressImages(memo.images)
              }))
            );
            
            const compressedJsonString = JSON.stringify(compressedMemos);
            localStorage.setItem(STORAGE_KEY, compressedJsonString);
            setMemos(compressedMemos);
            
            alert('画像サイズが大きかったため、自動的に圧縮して保存しました。');
            return;
          } catch (compressionError) {
            console.error('画像圧縮後の保存もエラー:', compressionError);
          }
        }
        
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          alert('画像のサイズが大きすぎるため、保存できませんでした。画像のサイズを小さくするか、枚数を減らしてください。');
        }
        throw error;
      }
    }
  };

  const addMemo = async (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMemo: Memo = {
      ...memo,
      id: `memo_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      images: memo.images || [],
      isPinned: false,
      type: memo.type || 'memo',
    };
    
    const updatedMemos = [...memos, newMemo];
    await saveMemos(updatedMemos);
    return newMemo;
  };

  const updateMemo = async (id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt'>>) => {
    const targetMemo = memos.find((memo: Memo) => memo.id === id);
    if (!targetMemo) {
      console.error('対象のメモが見つかりません:', id);
      return;
    }
    
    const updatedMemos = memos.map((memo: Memo) => {
      if (memo.id === id) {
        return { 
          ...memo, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
      }
      return memo;
    });
    
    await saveMemos(updatedMemos);
  };

  const deleteMemo = async (id: string) => {
    const updatedMemos = memos.filter((memo: Memo) => memo.id !== id);
    await saveMemos(updatedMemos);
  };

  const getMemo = (id: string) => {
    return memos.find((memo: Memo) => memo.id === id);
  };

  const getAllTags = () => {
    const tagsSet = new Set<string>();
    memos.forEach((memo: Memo) => {
      memo.tags.forEach((tag: string) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

  const importMemos = async (importedMemos: Memo[], replaceAll: boolean = false) => {
    let updatedMemos: Memo[];
    
    if (replaceAll) {
      updatedMemos = importedMemos;
    } else {
      const existingIds = new Set(memos.map((memo: Memo) => memo.id));
      const newMemos = importedMemos.filter((memo: Memo) => !existingIds.has(memo.id));
      updatedMemos = [...memos, ...newMemos];
    }
    
    await saveMemos(updatedMemos);
    return updatedMemos.length - memos.length;
  };

  const clearAllMemos = async () => {
    await saveMemos([]);
  };

  const togglePinMemo = async (id: string) => {
    const updatedMemos = memos.map((memo: Memo) => {
      if (memo.id === id) {
        return {
          ...memo,
          isPinned: !memo.isPinned,
          updatedAt: new Date().toISOString()
        };
      }
      return memo;
    });
    await saveMemos(updatedMemos);
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
