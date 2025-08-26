import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { getRelativeTime, formatDate } from '../utils/timeUtils';
import { parseMarkdown } from '../utils/markdownUtils';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import ImageViewerModal from '../components/modals/ImageViewerModal';

// メモタイプのラベルを取得するヘルパー関数
function getMemoTypeLabel(type?: string): string {
  switch (type) {
    case 'note':
      return '📝 ノート';
    case 'wiki':
      return '📚 Wiki';
    default:
      return '📄 メモ';
  }
}

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
  }, [memo]);

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
      await deleteMemo(memo.id);
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
  
  const downloadImage = (imageUrl: string, index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 画像ビューアーが開かれないようにする
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = imageUrl;
      
      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${memo.title.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_')}_${index + 1}_${timestamp}.jpg`;
      
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
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
              {getMemoTypeLabel(memo.type)}
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

        {/* 画像ギャラリー */}
        {memo.images && memo.images.length > 0 ? (
          <div className="memo-detail-images">
            <h3 className="memo-detail-images-title">
              🖼️ 画像 ({memo.images.length}枚)
            </h3>
            <div className={`memo-detail-images-grid ${memo.images.length === 1 ? 'single' : 'multiple'}`}>
              {memo.images.map((image, index) => (
                <div 
                  key={`image-${memo.id}-${index}`}
                  className={`memo-detail-image-item ${memo.images!.length === 1 ? 'single' : 'multiple'}`}
                  onClick={() => handleImageClick(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleImageClick(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`画像 ${index + 1} を拡大表示`}
                  title="クリックで拡大表示"
                >
                  <img
                    src={image}
                    alt={`${memo.title} - 画像 ${index + 1}`}
                    className="memo-detail-image"
                    loading="lazy"
                  />
                  <div className="memo-detail-image-overlay">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <span className="memo-detail-image-counter">
                        {index + 1} / {memo.images!.length}
                      </span>
                      <button
                        onClick={(e) => downloadImage(image, index, e)}
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          backdropFilter: 'blur(4px)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title="画像をダウンロード"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="memo-detail-images">
            <div className="memo-detail-image-placeholder">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500', fontSize: '0.875rem', color: 'var(--text-muted)' }}>画像はありません</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>編集で画像を追加できます</p>
              </div>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="memo-detail-actions">
          <button 
            onClick={() => navigate(`/memo/edit/${memo.id}`)} 
            className="btn btn-primary btn-lg memo-action-btn"
          >
            ✏️ 編集
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="btn btn-danger btn-lg memo-action-btn"
          >
            🗑️ 削除
          </button>
        </div>
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
      
      {/* 画像ビューアーモーダル */}
      {memo.images && memo.images.length > 0 && (
        <ImageViewerModal
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
          images={[...memo.images]}
          initialIndex={selectedImageIndex}
          title={memo.title}
        />
      )}
    </div>
  );
}

export default MemoDetail;