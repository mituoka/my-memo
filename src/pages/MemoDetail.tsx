import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { getRelativeTime, formatDate } from '../utils/timeUtils';
import { parseMarkdown } from '../utils/markdownUtils';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

function MemoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { memos, deleteMemo } = useMemoStorage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const memo = memos.find(m => m.id === id);
  const memoIndex = memos.findIndex(m => m.id === id);
  
  const { prevMemo, nextMemo } = useMemo(() => {
    return {
      prevMemo: memoIndex > 0 ? memos[memoIndex - 1] : null,
      nextMemo: memoIndex < memos.length - 1 ? memos[memoIndex + 1] : null
    };
  }, [memos, memoIndex]);
  
  const parsedContent = useMemo(() => {
    return memo ? parseMarkdown(memo.content) : '';
  }, [memo?.content]);

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

  const handleDelete = async () => {
    if (!memo) return;
    
    setIsDeleting(true);
    try {
      deleteMemo(memo.id);
      setShowDeleteModal(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete memo:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleTagClick = (tag: string) => {
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="memo-detail-container">
      {/* 固定ヘッダー */}
      <div className="memo-detail-header">
        <div className="memo-detail-actions">
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            ← 戻る
          </button>
          <button 
            onClick={() => navigate(`/memo/edit/${memo.id}`)} 
            className="btn btn-primary"
          >
            ✏️ 編集
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="btn btn-danger"
          >
            🗑️ 削除
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <article className="memo-detail-card">
        {/* メタ情報 */}
        <header className="memo-detail-meta">
          <h1 className="memo-detail-title">{memo.title}</h1>
          <div className="memo-detail-info">
            <span title={formatDate(memo.createdAt)}>
              📅 作成: {getRelativeTime(memo.createdAt)}
            </span>
            <span title={formatDate(memo.updatedAt)}>
              🕒 更新: {getRelativeTime(memo.updatedAt)}
            </span>
            <span className={`memo-type-badge ${memo.type || 'memo'}`}>
              {memo.type === 'note' ? '📝 ノート' : memo.type === 'wiki' ? '📚 Wiki' : '📄 メモ'}
            </span>
          </div>
        </header>

        {/* コンテンツ */}
        <div 
          className="memo-detail-content"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />

        {/* タグ */}
        {memo.tags && memo.tags.length > 0 && (
          <div className="memo-detail-tags">
            <h3 className="memo-detail-tags-title">🏷️ タグ</h3>
            <div className="memo-detail-tags-list">
              {memo.tags.map(tag => (
                <button 
                  key={tag}
                  className="memo-tag"
                  onClick={() => handleTagClick(tag)}
                  title={`「${tag}」でフィルター`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* ナビゲーション */}
      <nav className="memo-navigation">
        <button
          className="memo-nav-button"
          onClick={() => prevMemo && navigate(`/memo/${prevMemo.id}`)}
          disabled={!prevMemo}
          title={prevMemo?.title}
        >
          ← 前のメモ
          {prevMemo && (
            <span style={{ fontSize: '0.75rem', opacity: 0.7, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {prevMemo.title}
            </span>
          )}
        </button>
        
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {memoIndex + 1} / {memos.length}
        </span>
        
        <button
          className="memo-nav-button"
          onClick={() => nextMemo && navigate(`/memo/${nextMemo.id}`)}
          disabled={!nextMemo}
          title={nextMemo?.title}
        >
          次のメモ →
          {nextMemo && (
            <span style={{ fontSize: '0.75rem', opacity: 0.7, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextMemo.title}
            </span>
          )}
        </button>
      </nav>

      {/* 削除確認モーダル */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={memo.title}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default MemoDetail;