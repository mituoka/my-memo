import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import MemoEditor from '../components/MemoEditor';
import { Memo } from '../types';

function EditMemo() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getMemo, isLoaded } = useMemoStorage();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!id) {
      alert('メモIDが指定されていません');
      navigate('/');
      return;
    }

    const memoData = getMemo(id);
    
    if (memoData) {
      setMemo(memoData);
    } else {
      alert('メモが見つかりませんでした');
      navigate('/');
      return;
    }
    setIsLoading(false);
  }, [id, getMemo, navigate, isLoaded]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="text-secondary">メモが見つかりませんでした</p>
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