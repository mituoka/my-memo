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
    tags: memo?.tags.map(tag => tag.name) || [],
    images: memo?.images || [],
  });

  // メモデータが変更された場合、フォームを更新
  useEffect(() => {
    if (memo && mode === 'edit') {
      actions.reset({
        title: memo.title,
        content: memo.content,
        tags: memo.tags.map(tag => tag.name),
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
      if (mode === 'edit' && memo) {
        updateMemoStorage(memo.id, {
          title: state.title.trim(),
          content: state.content.trim(),
          tags: state.tags,
          images: state.images,
        });
        navigate('/');
      } else {
        addMemo({
          title: state.title.trim(),
          content: state.content.trim(),
          tags: state.tags,
          images: state.images,
        });
        navigate('/');
      }
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
