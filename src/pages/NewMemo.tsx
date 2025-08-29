import React, { useCallback } from 'react';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { MemoFormBase, MemoFormData } from '../components/forms/MemoFormBase';

function NewMemo() {
  const { addMemo } = useMemoStorage();
  
  // キーボードナビゲーションを有効化
  useKeyboardNavigation();

  // メモ作成処理
  const handleSubmit = useCallback(async (data: MemoFormData) => {
    const memoData = {
      title: data.title.trim(),
      content: data.content.trim(),
      tags: data.tags,
      images: data.images,
      type: data.type,
    };

    await addMemo(memoData);
  }, [addMemo]);

  return (
    <MemoFormBase
      onSubmit={handleSubmit}
      submitButtonText="作成する"
      pageTitle="新しいメモを作成"
      pageDescription="新しいメモを作成してください"
    />
  );
}

export default NewMemo;