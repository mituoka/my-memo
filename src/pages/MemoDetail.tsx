import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { getRelativeTime, formatDate } from '../utils/timeUtils';
import { parseMarkdown } from '../utils/markdownUtils';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import ImageViewerModal from '../components/modals/ImageViewerModal';

// メモタイプのラベルとアイコンを取得するヘルパー関数
function getMemoTypeInfo(type?: string): { label: string; icon: JSX.Element } {
  const iconProps = { width: "14", height: "14", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: "1.5" };
  
  switch (type) {
    case 'note':
      return {
        label: 'ノート',
        icon: (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        )
      };
    case 'wiki':
      return {
        label: 'Wiki',
        icon: (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        )
      };
    default:
      return {
        label: 'メモ',
        icon: (
          <svg {...iconProps}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        )
      };
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
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{marginRight: '4px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
              </svg>
              作成: {getRelativeTime(memo.createdAt)}
            </span>
            <span title={formatDate(memo.updatedAt)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{marginRight: '4px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              更新: {getRelativeTime(memo.updatedAt)}
            </span>
            <span className={`memo-type-badge ${memo.type || 'memo'}`}>
              {getMemoTypeInfo(memo.type).icon}
              {getMemoTypeInfo(memo.type).label}
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
            <h3 className="memo-detail-tags-title">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{marginRight: '6px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              タグ
            </h3>
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
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{marginRight: '6px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              画像 ({memo.images.length}枚)
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
            className="btn btn-primary"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{marginRight: '6px'}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            編集
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="btn btn-danger"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" style={{marginRight: '6px'}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            削除
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