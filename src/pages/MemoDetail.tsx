import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { getRelativeTime, formatDate } from '../utils/timeUtils';
import { parseMarkdown } from '../utils/markdownUtils';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import ImageViewerModal from '../components/modals/ImageViewerModal';

function MemoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { memos, deleteMemo } = useMemoStorage();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
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
  
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  };

  return (
    <div className="memo-detail-container">

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

      {/* 画像ギャラリー */}
      {memo.images && memo.images.length > 0 ? (
        <div className="memo-images">
          <h3 className="memo-images-title">
            🖼️ 画像 ({memo.images.length}枚)
          </h3>
          <div className={`memo-images-grid ${memo.images.length === 1 ? 'single' : 'multiple'}`}>
            {memo.images.map((image, index) => (
              <div 
                key={index} 
                className={`memo-image-item ${memo.images!.length === 1 ? 'single' : 'multiple'}`}
                onClick={() => handleImageClick(index)}
                title="クリックで拡大表示"
              >
                <img
                  src={image}
                  alt={`${memo.title} - 画像 ${index + 1}`}
                  className="memo-image"
                  loading="lazy"
                />
                <div className="memo-image-overlay">
                  <span className="memo-image-counter">
                    {index + 1} / {memo.images!.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="memo-images">
          <div className="memo-image-placeholder">
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>画像はありません</p>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>編集で画像を追加できます</p>
            </div>
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div className="memo-actions">
        <button 
          onClick={() => navigate(`/memo/edit/${memo.id}`)} 
          className="btn btn-primary btn-sm"
        >
          ✏️ 編集
        </button>
        <button 
          onClick={() => setShowDeleteModal(true)} 
          className="btn btn-danger btn-sm"
        >
          🗑️ 削除
        </button>
      </div>

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
      
      {/* 画像ビューアーモーダル */}
      {memo.images && memo.images.length > 0 && (
        <ImageViewerModal
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
          images={memo.images}
          initialIndex={selectedImageIndex}
          title={memo.title}
        />
      )}
    </div>
  );
}

export default MemoDetail;