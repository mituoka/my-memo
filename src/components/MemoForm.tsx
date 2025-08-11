'use client';

import { useState, useCallback } from 'react';
import type { MemoFormState, ApiError } from '@/types';

// エラーメッセージを取得するヘルパー関数
const getErrorMessage = (error: ApiError | string | null | undefined): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error.message) return error.message;
  return 'エラーが発生しました';
};

// フォームコンポーネントの属性型
interface MemoFormProps {
  readonly title: string;
  readonly onTitleChange: (title: string) => void;
  readonly content: string;
  readonly onContentChange: (content: string) => void;
  readonly tagInput: string;
  readonly onTagInputChange: (tagInput: string) => void;
  readonly tags: readonly string[];
  readonly onAddTag: () => void;
  readonly onRemoveTag: (tag: string) => void;
  readonly images: readonly string[];
  readonly onImageAdd: (images: string[]) => void;
  readonly onImageRemove: (index: number) => void;
  readonly onSubmit: (e: React.FormEvent) => Promise<void>;
  readonly onCancel: () => void;
  readonly isSaving: boolean;
  readonly error: ApiError | string | null | undefined;
}

// 再利用可能なフォームコンポーネント
export function MemoForm({
  title,
  onTitleChange,
  content,
  onContentChange,
  tagInput,
  onTagInputChange,
  tags,
  onAddTag,
  onRemoveTag,
  images,
  onImageAdd,
  onImageRemove,
  onSubmit,
  onCancel,
  isSaving,
  error
}: MemoFormProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {errorMessage && (
        <div style={{
          background: 'var(--error-bg, #fef2f2)',
          borderLeft: '4px solid var(--error)',
          padding: '1rem',
          borderRadius: '4px'
        }}>
          <p style={{ color: 'var(--error)', margin: 0 }}>{errorMessage}</p>
        </div>
      )}
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="title" 
          style={{ 
            display: 'block',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}
        >
          タイトル <span style={{ color: 'var(--error)' }}>*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="input"
          placeholder="タイトルを入力"
          required
        />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="content" 
          style={{ 
            display: 'block',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}
        >
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="input textarea"
          placeholder="メモの内容を入力"
          style={{ minHeight: '200px' }}
        />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="tag-input" 
          style={{ 
            display: 'block',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}
        >
          タグ
        </label>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            id="tag-input"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            className="input"
            placeholder="タグを入力"
            style={{ 
              flex: 1,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              marginBottom: 0
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddTag();
              }
            }}
          />
          <button
            type="button"
            onClick={onAddTag}
            className="btn btn-primary"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              marginLeft: '-1px'
            }}
          >
            追加
          </button>
        </div>
        
        {tags.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem', 
            marginTop: '0.75rem' 
          }}>
            {tags.map(tag => (
              <span 
                key={tag} 
                style={{
                  background: 'var(--primary-light, #dbeafe)',
                  color: 'var(--primary-dark, #1e40af)',
                  fontSize: '0.875rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => onRemoveTag(tag)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    lineHeight: 1,
                    padding: 0,
                    marginLeft: '0.25rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label 
          htmlFor="images" 
          style={{ 
            display: 'block',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}
        >
          画像
        </label>
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            console.log('選択されたファイル数:', files.length);
            
            const imagePromises = files.map((file, index) => {
              console.log(`ファイル${index + 1}:`, file.name, file.type, file.size);
              return new Promise<string>((resolve) => {
                // 画像をリサイズ・圧縮する関数
                const resizeAndCompress = (file: File) => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d')!;
                  const img = new Image();
                  
                  img.onload = () => {
                    // 最大サイズを800pxに設定（アスペクト比を維持）
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    
                    let { width, height } = img;
                    
                    if (width > height) {
                      if (width > MAX_WIDTH) {
                        height = (height * MAX_WIDTH) / width;
                        width = MAX_WIDTH;
                      }
                    } else {
                      if (height > MAX_HEIGHT) {
                        width = (width * MAX_HEIGHT) / height;
                        height = MAX_HEIGHT;
                      }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // 画像を描画
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // 圧縮（品質0.8で約80%の品質）
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    console.log(`ファイル${index + 1} 圧縮完了:`, 
                      `元サイズ: ${file.size} bytes`, 
                      `圧縮後サイズ: ${Math.round(compressedDataUrl.length * 0.75)} bytes`);
                    
                    resolve(compressedDataUrl);
                  };
                  
                  // Fileオブジェクトを画像として読み込み
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    img.src = e.target?.result as string;
                  };
                  reader.readAsDataURL(file);
                };
                
                resizeAndCompress(file);
              });
            });
            
            Promise.all(imagePromises).then((results) => {
              console.log('全ファイル処理完了:', results.length);
              onImageAdd(results);
            });
          }}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}
        />
        
        {images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: images.length === 1 ? '1fr' : images.length === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            {images.map((image, index) => (
              <div 
                key={index} 
                style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}
                onMouseEnter={(e) => {
                  const button = e.currentTarget.querySelector('button');
                  if (button) (button as HTMLElement).style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const button = e.currentTarget.querySelector('button');
                  if (button) (button as HTMLElement).style.opacity = '0';
                }}
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  style={{
                    width: '100%',
                    height: images.length === 1 ? '300px' : images.length === 2 ? '200px' : '150px',
                    objectFit: 'cover',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--error, #ef4444)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    cursor: 'pointer',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSaving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isSaving && (
            <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
          )}
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
      </form>
    </div>
  );
}

// フォーム状態とロジックを管理するカスタムフック
export const useMemoForm = (initialState?: Partial<MemoFormState>) => {
  const [state, setState] = useState<MemoFormState>({
    title: initialState?.title || '',
    content: initialState?.content || '',
    tagInput: '',
    tags: initialState?.tags || [],
    images: initialState?.images || [],
  });

  const updateTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }));
  }, []);

  const updateContent = useCallback((content: string) => {
    setState(prev => ({ ...prev, content }));
  }, []);

  const updateTagInput = useCallback((tagInput: string) => {
    setState(prev => ({ ...prev, tagInput }));
  }, []);

  const addTag = useCallback(() => {
    const trimmedTag = state.tagInput.trim();
    if (trimmedTag && !state.tags.includes(trimmedTag)) {
      setState(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
        tagInput: '',
      }));
    }
  }, [state.tagInput, state.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  const addImages = useCallback((newImages: string[]) => {
    console.log('画像を追加:', newImages.length + '枚');
    setState(prev => {
      const updatedState = {
        ...prev,
        images: [...prev.images, ...newImages],
      };
      console.log('更新後のstate:', updatedState);
      return updatedState;
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const reset = useCallback((newState?: Partial<MemoFormState>) => {
    setState({
      title: newState?.title || '',
      content: newState?.content || '',
      tagInput: '',
      tags: newState?.tags || [],
      images: newState?.images || [],
    });
  }, []);

  return {
    state,
    actions: {
      updateTitle,
      updateContent,
      updateTagInput,
      addTag,
      removeTag,
      addImages,
      removeImage,
      reset,
    },
  };
};
