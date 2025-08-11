'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemoForm, useMemoForm } from './MemoForm';
import { useMemoStorage } from '../hooks/useMemoStorage';
import type { MemoEditorProps } from '@/types';

export default function MemoEditor({ memo, mode }: Readonly<MemoEditorProps>) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { addMemo, updateMemo: updateMemoStorage } = useMemoStorage();
  
  const { state, actions } = useMemoForm({
    title: memo?.title || '',
    content: memo?.content || '',
    tags: memo?.tags || [],
    images: memo?.images || [],
  });

  // メモデータが変更された場合、フォームを更新
  useEffect(() => {
    if (memo && mode === 'edit') {
      actions.reset({
        title: memo.title,
        content: memo.content,
        tags: memo.tags,
        images: memo.images || [],
      });
    }
  }, [memo, mode, actions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      console.log('=== 保存処理開始 ===');
      console.log('保存前のstate:', { 
        title: state.title.trim(), 
        content: state.content.trim(), 
        tags: state.tags, 
        images: state.images,
        imagesLength: state.images.length,
        imagesData: state.images.map(img => img.substring(0, 50) + '...')
      });
      
      // 少し待機してから保存処理を実行
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (mode === 'edit' && memo) {
        const updateData = {
          title: state.title.trim(),
          content: state.content.trim(),
          tags: state.tags,
          images: state.images,
        };
        console.log('更新データ:', updateData);
        console.log('更新データの画像数:', updateData.images.length);
        
        updateMemoStorage(memo.id, updateData);
        
        // 保存が完了するまで少し待機
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('=== 更新完了、画面遷移 ===');
        
      } else {
        const createData = {
          title: state.title.trim(),
          content: state.content.trim(),
          tags: state.tags,
          images: state.images,
        };
        console.log('作成データ:', createData);
        console.log('作成データの画像数:', createData.images.length);
        
        const result = addMemo(createData);
        console.log('作成結果:', result);
        
        // 保存が完了するまで少し待機
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('=== 作成完了、画面遷移 ===');
      }
      
      navigate('/');
    } catch (error) {
      console.error('保存中にエラーが発生しました:', error);
      setError('保存中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <MemoForm
      title={state.title}
      onTitleChange={actions.updateTitle}
      content={state.content}
      onContentChange={actions.updateContent}
      tagInput={state.tagInput}
      onTagInputChange={actions.updateTagInput}
      tags={state.tags}
      onAddTag={actions.addTag}
      onRemoveTag={actions.removeTag}
      images={state.images}
      onImageAdd={actions.addImages}
      onImageRemove={actions.removeImage}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSaving={isSaving}
      error={error}
    />
  );
}
