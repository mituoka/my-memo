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
  const compressImage = (imageDataUrl: string, maxSizeKB: number = 300): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // アスペクト比を保持しながらサイズを調整（より積極的に圧縮）
          let { width, height } = img;
          let maxDimension = 800; // 最大サイズをより小さく
          
          // 元の画像サイズに応じて最大サイズを調整
          if (width * height > 1000000) { // 1MP以上の場合はさらに小さく
            maxDimension = 600;
          }
          
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
          let quality = 0.7; // 初期品質を下げる
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // 目標サイズに達するまで品質を下げる
          while (compressedDataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.05) {
            quality -= 0.05;
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          
          // それでも大きすぎる場合はサイズをさらに縮小
          if (compressedDataUrl.length > maxSizeKB * 1024 * 1.37 && maxDimension > 300) {
            maxDimension = Math.max(300, maxDimension * 0.8);
            width = Math.min(width, maxDimension);
            height = Math.min(height, maxDimension);
            
            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);
            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
          }
          
          resolve(compressedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
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
            
            // より積極的な圧縮を実施（エラー処理を強化）
            const compressedMemos: Memo[] = [];
            for (const memo of updatedMemos) {
              try {
                const compressedImages = await compressImages(memo.images);
                compressedMemos.push({
                  ...memo,
                  images: compressedImages
                });
              } catch (error) {
                console.warn('メモの画像圧縮でエラー:', error);
                // 画像圧縮に失敗した場合は画像を削除
                compressedMemos.push({
                  ...memo,
                  images: []
                });
              }
            }
            
            let compressedJsonString = JSON.stringify(compressedMemos);
            
            // それでも大きすぎる場合は、さらに画像を削減
            if (compressedJsonString.length > 5 * 1024 * 1024) {
              console.warn('圧縮後もサイズが大きすぎます。画像数を制限します。');
              
              const furtherReducedMemos = compressedMemos.map(memo => ({
                ...memo,
                images: memo.images ? memo.images.slice(0, Math.max(1, Math.floor(3 * memo.images.length / 4))) : [] // 画像数を3/4に制限
              }));
              
              compressedJsonString = JSON.stringify(furtherReducedMemos);
            }
            
            localStorage.setItem(STORAGE_KEY, compressedJsonString);
            setMemos(JSON.parse(compressedJsonString));
            
            console.log('✅ 画像圧縮保存が成功しました');
            alert('画像サイズが大きかったため、自動的に圧縮して保存しました。\n一部の画像が削除された可能性があります。');
            return;
          } catch (compressionError) {
            console.error('画像圧縮後の保存もエラー:', compressionError);
            
            // 最後の手段：画像を全て削除して保存を試行
            try {
              console.log('最後の手段：画像を削除して保存を試行します...');
              const noImageMemos = updatedMemos.map(memo => ({
                ...memo,
                images: []
              }));
              
              localStorage.setItem(STORAGE_KEY, JSON.stringify(noImageMemos));
              setMemos(noImageMemos);
              
              console.log('✅ 画像削除保存が成功しました');
              alert('ローカルストレージの容量が不足したため、すべての画像を削除して保存しました。');
              return;
            } catch (finalError) {
              console.error('画像削除後も保存に失敗:', finalError);
            }
          }
        }
        
        // この時点で到達する場合は、画像圧縮も含めてすべての保存方法が失敗した場合のみ
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
