import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import MemoEditor from '../components/MemoEditor';

function EditMemo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { memos, isLoaded } = useMemoStorage();

  // メモを直接memosから取得（リアクティブ）
  const memo = useMemo(() => {
    if (!id || !isLoaded) return null;
    return memos.find(m => m.id === id) || null;
  }, [id, memos, isLoaded]);

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

  return (
    <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          margin: '0 0 0.5rem 0',
          color: 'var(--text-primary)'
        }}>
          メモを編集
        </h1>
        <p className="text-secondary" style={{ margin: 0 }}>
          メモの内容を編集してください
        </p>
        
        {/* Meta Info */}
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--background)',
          borderRadius: '4px',
          fontSize: '0.8125rem'
        }}>
          <p className="text-muted" style={{ margin: '0 0 0.25rem 0' }}>
            作成日時: {new Date(memo.createdAt).toLocaleString('ja-JP')}
          </p>
          {memo.updatedAt !== memo.createdAt && (
            <p className="text-muted" style={{ margin: 0 }}>
              最終更新: {new Date(memo.updatedAt).toLocaleString('ja-JP')}
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="card slide-in-right" style={{ 
        padding: '2rem',
        animationDelay: '0.2s'
      }}>
        <MemoEditor memo={memo} mode="edit" />
      </div>
    </div>
  );
}

export default EditMemo;