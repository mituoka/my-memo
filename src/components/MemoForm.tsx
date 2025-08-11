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
    <form onSubmit={onSubmit} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="タイトルを入力"
          required
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] dark:bg-gray-700 dark:text-white"
          placeholder="メモの内容を入力"
        />
      </div>
      
      <div>
        <label htmlFor="tag-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          タグ
        </label>
        <div className="flex">
          <input
            type="text"
            id="tag-input"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            className="block flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="タグを入力"
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
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            追加
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full flex items-center"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => onRemoveTag(tag)} 
                  className="ml-1 text-blue-800 dark:text-blue-200 hover:text-blue-500 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          画像
        </label>
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const imagePromises = files.map(file => {
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
              });
            });
            
            Promise.all(imagePromises).then(onImageAdd);
          }}
          className="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            dark:file:bg-blue-900 dark:file:text-blue-200
            dark:hover:file:bg-blue-800"
        />
        
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          disabled={isSaving}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              保存中...
            </span>
          ) : (
            '保存'
          )}
        </button>
      </div>
    </form>
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
    setState(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
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
