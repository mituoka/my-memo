import React, { useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { MemoFormBase, MemoFormData } from '../components/forms/MemoFormBase';
import { formatDate } from '../utils/timeUtils';

function EditMemo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { memos, isLoaded, updateMemo } = useMemoStorage();
  
  // キーボードナビゲーションを有効化
  useKeyboardNavigation();

  // メモを直接memosから取得（リアクティブ）
  const memo = useMemo(() => {
    if (!id || !isLoaded) return null;
    return memos.find(m => m.id === id) || null;
  }, [id, memos, isLoaded]);

  // メモ更新処理
  const handleSubmit = useCallback(async (data: MemoFormData) => {
    if (!memo || !id) throw new Error('メモが見つかりません');

    const memoData = {
      title: data.title.trim(),
      content: data.content.trim(),
      tags: data.tags,
      images: data.images,
      type: data.type,
    };

    await updateMemo(id, memoData);
  }, [memo, id, updateMemo]);

  // データ読み込み前はスケルトンを表示
  if (!isLoaded) {
    return (
      <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '200px',
            height: '32px',
            background: 'var(--skeleton-base)',
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }} className="skeleton" />
          <div style={{
            width: '300px',
            height: '16px',
            background: 'var(--skeleton-base)',
            borderRadius: '4px'
          }} className="skeleton" />
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{
            width: '100%',
            height: '300px',
            background: 'var(--skeleton-base)',
            borderRadius: '8px'
          }} className="skeleton" />
        </div>
      </div>
    );
  }

  // IDが無効またはメモが見つからない場合
  if (!id) {
    navigate('/', { replace: true });
    return null;
  }

  if (!memo) {
    return (
      <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="text-secondary">メモが見つかりませんでした</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  // 初期データの準備
  const initialData: Partial<MemoFormData> = {
    title: memo.title,
    content: memo.content,
    tags: [...memo.tags],
    images: [...memo.images || []],
    type: memo.type || 'memo'
  };

  // メタ情報コンポーネント
  const metaInfo = (
    <div style={{ 
      marginTop: '1rem',
      padding: '1rem',
      background: 'var(--background)',
      borderRadius: '4px',
      fontSize: '0.8125rem'
    }}>
      <p className="text-muted" style={{ margin: '0 0 0.25rem 0' }}>
        作成日時: {formatDate(memo.createdAt)}
      </p>
      {memo.updatedAt !== memo.createdAt && (
        <p className="text-muted" style={{ margin: 0 }}>
          最終更新: {formatDate(memo.updatedAt)}
        </p>
      )}
    </div>
  );

  return (
    <MemoFormBase
      initialData={initialData}
      onSubmit={handleSubmit}
      submitButtonText="更新する"
      isEdit={true}
      pageTitle="メモを編集"
      pageDescription="メモの内容を編集してください"
      metaInfo={metaInfo}
    />
  );
}

export default EditMemo;