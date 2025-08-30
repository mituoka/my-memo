import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Memo, ViewSettings, CardLayoutSettings } from '../../../types';
import { getRelativeTime, formatDate } from '../../../utils/timeUtils';
import { parseMarkdown } from '../../../utils/markdownUtils';

interface MemoGridProps {
  readonly memos: readonly Memo[];
  readonly hasActiveFilters: boolean;
  readonly searchTerm: string;
  readonly viewSettings: ViewSettings;
  readonly cardLayoutSettings: CardLayoutSettings;
  readonly onDeleteMemo: (id: string) => Promise<void>;
  readonly onTogglePin: (id: string) => Promise<void>;
  readonly onClearFilters: () => void;
}

export const MemoGrid: React.FC<MemoGridProps> = ({
  memos,
  hasActiveFilters,
  searchTerm,
  viewSettings,
  cardLayoutSettings,
  onDeleteMemo,
  onTogglePin,
  onClearFilters
}) => {
  const navigate = useNavigate();

  // 日付フォーマット関数
  const getDateLabel = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString('ja-JP');
  }, []);

  // 検索結果なしの場合
  if (memos.length === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="text-secondary">
          {hasActiveFilters 
            ? 'フィルター条件に一致するメモが見つかりません'
            : `「${searchTerm}」に一致するメモが見つかりません`
          }
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--primary)',
              borderRadius: '6px',
              background: 'var(--primary)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            フィルターをクリア
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`view-${viewSettings.mode} layout-${cardLayoutSettings.layout}`}>
        {memos.map((memo, index) => (
          <div
            key={memo.id}
            className={`memo-card ${memo.isPinned ? 'pinned' : ''} fade-in-up`}
            style={{
              animationDelay: `${index * 0.05}s`,
              padding: '1.5rem',
              background: 'var(--surface)',
              border: memo.isPinned ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              boxShadow: memo.isPinned ? 'var(--shadow-lg)' : 'var(--shadow)'
            }}
            onClick={() => navigate(`/memo/${memo.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = memo.isPinned ? 'var(--shadow-lg)' : 'var(--shadow)';
            }}
          >
            {/* ピン表示 */}
            {memo.isPinned && (
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                color: 'var(--primary)',
                fontSize: '0.875rem'
              }}>
                📌
              </div>
            )}

            {/* メモタイプ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: memo.type === 'memo' ? '#3B82F6' : memo.type === 'note' ? '#10B981' : '#F59E0B'
              }}></div>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                fontWeight: '500'
              }}>
                {memo.type === 'memo' ? 'メモ' : memo.type === 'note' ? 'ノート' : 'Wiki'}
              </span>
            </div>

            {/* タイトル */}
            <h3 style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              lineHeight: '1.4',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {memo.title}
            </h3>

            {/* コンテンツプレビュー */}
            {memo.content && (
              <div style={{
                marginBottom: '1rem',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: viewSettings.mode === 'list' ? 2 : 3,
                WebkitBoxOrient: 'vertical'
              }}>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: parseMarkdown(memo.content.substring(0, 200) + (memo.content.length > 200 ? '...' : ''))
                  }}
                  style={{ 
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    color: 'inherit'
                  }}
                />
              </div>
            )}

            {/* 画像プレビュー */}
            {memo.images && memo.images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: memo.images.length === 1 
                  ? '1fr' 
                  : memo.images.length === 2 
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
                gap: '0.5rem',
                marginBottom: '1rem',
                maxHeight: memo.images.length === 1 ? '120px' : '80px'
              }}>
                {memo.images.slice(0, 3).map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    style={{
                      width: '100%',
                      height: memo.images!.length === 1 ? '120px' : '80px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      position: 'relative',
                      backgroundColor: 'var(--background)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = 'var(--shadow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={image}
                      alt={`${memo.title} - 画像 ${imageIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      loading="lazy"
                    />
                    {memo.images!.length > 3 && imageIndex === 2 && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        +{memo.images!.length - 2}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* タグ */}
            {memo.tags.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.375rem',
                marginBottom: '1rem'
              }}>
                {memo.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="tag"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
                {memo.tags.length > 3 && (
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    padding: '0.25rem 0.5rem'
                  }}>
                    +{memo.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* フッター */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>作成: {getDateLabel(memo.createdAt)}</span>
                {memo.updatedAt !== memo.createdAt && (
                  <>
                    <span>•</span>
                    <span title={formatDate(memo.updatedAt)}>
                      更新: {getRelativeTime(memo.updatedAt)}
                    </span>
                  </>
                )}
              </div>

              {/* アクションボタン */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(memo.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    color: memo.isPinned ? 'var(--primary)' : 'var(--text-muted)',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title={memo.isPinned ? 'ピンを外す' : 'ピン留めする'}
                >
                  📌
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('このメモを削除しますか？')) {
                      onDeleteMemo(memo.id);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--error-light)';
                    e.currentTarget.style.color = 'var(--error)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};