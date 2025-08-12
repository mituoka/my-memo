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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (mode === 'edit' && memo) {
        const updateData = {
          title: state.title.trim(),
          content: state.content.trim(),
          tags: state.tags,
          images: state.images,
        };
        
        updateMemoStorage(memo.id, updateData);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } else {
        const createData = {
          title: state.title.trim(),
          content: state.content.trim(),
          tags: state.tags,
          images: state.images,
        };
        
        addMemo(createData);
        
        await new Promise(resolve => setTimeout(resolve, 200));
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
