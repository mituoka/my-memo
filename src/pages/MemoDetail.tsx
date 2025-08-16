import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';

function MemoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { memos, deleteMemo } = useMemoStorage();
  
  const memo = memos.find(m => m.id === id);

  if (!memo) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>メモが見つかりません</h1>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          ホームに戻る
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('このメモを削除しますか？')) {
      deleteMemo(memo.id);
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          ← 戻る
        </button>
        <button 
          onClick={() => navigate(`/memo/edit/${memo.id}`)} 
          className="btn btn-primary"
        >
          編集
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          削除
        </button>
      </div>

      <article>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            {memo.title}
          </h1>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-muted)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <span>作成: {new Date(memo.createdAt).toLocaleString()}</span>
            <span>更新: {new Date(memo.updatedAt).toLocaleString()}</span>
            <span className={`memo-type-badge ${memo.type}`}>
              {memo.type === 'note' ? 'ノート' : 'Wiki'}
            </span>
          </div>
        </header>

        <div style={{
          fontSize: '1rem',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap'
        }}>
          {memo.content}
        </div>

        {memo.tags && memo.tags.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>タグ</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {memo.tags.map(tag => (
                <span 
                  key={tag}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

export default MemoDetail;