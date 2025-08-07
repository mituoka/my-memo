'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MemoForm, useMemoForm } from './MemoForm';
import { useCreateMemo, useUpdateMemo } from '@/hooks/useMemoApi';
import type { MemoEditorProps, MemoCreate, MemoUpdate } from '@/types';

export default function MemoEditor({ memo, mode }: Readonly<MemoEditorProps>) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const { createMemo, error: createError } = useCreateMemo();
  const { updateMemo, error: updateError } = useUpdateMemo();
  
  const { state, actions } = useMemoForm({
    title: memo?.title || '',
    content: memo?.content || '',
    tags: memo?.tags.map(tag => tag.name) || [],
  });

  // メモデータが変更された場合、フォームを更新
  useEffect(() => {
    if (memo && mode === 'edit') {
      actions.reset({
        title: memo.title,
        content: memo.content,
        tags: memo.tags.map(tag => tag.name),
      });
    }
  }, [memo, mode, actions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    setIsSaving(true);
    
    try {
      if (mode === 'edit' && memo) {
        const updateData: MemoUpdate = {
          title: state.title,
          content: state.content,
          tags: state.tags,
        };
        
        const result = await updateMemo(memo.id, updateData);
        if (result) {
          router.push(`/memo/${memo.id}`);
        }
      } else {
        const createData: MemoCreate = {
          title: state.title,
          content: state.content,
          tags: state.tags,
        };
        
        const result = await createMemo(createData);
        if (result) {
          router.push(`/memo/${result.id}`);
        }
      }
    } catch (error) {
      console.error('保存中にエラーが発生しました:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (mode === 'edit' && memo) {
      router.push(`/memo/${memo.id}`);
    } else {
      router.push('/');
    }
  };

  const error = createError || updateError;

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
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSaving={isSaving}
      error={error}
    />
  );
}
