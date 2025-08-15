import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useMemoSort } from '../hooks/useMemoSort';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { AdvancedSearchPanel } from '../components/AdvancedSearchPanel';
import { MemoGridSkeleton, SearchSkeleton } from '../components/common/SkeletonLoader';

function Home() {
  const navigate = useNavigate();
  const { memos, isLoaded, deleteMemo, togglePinMemo } = useMemoStorage();
  
  const { sortedMemos, sortSettings, updateSort, getSortLabel } = useMemoSort(memos);
  
  const {
    filters,
    filteredMemos: searchFilteredMemos,
    allTags,
    updateSearchTerm,
    toggleTag,
    toggleType,
    setImageFilter,
    setDateRange,
    clearFilters,
    hasActiveFilters
  } = useAdvancedSearch(sortedMemos);

  const filteredMemos = searchFilteredMemos;

  // キーボードナビゲーションを有効化
  useKeyboardNavigation();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`「${title}」を削除しますか？`)) {
      deleteMemo(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString('ja-JP');
  };

  if (!isLoaded) {
    return (
      <div>
        {/* Header Section Skeleton */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem' 
          }}>
            <div style={{
              width: '150px',
              height: '20px',
              background: 'var(--skeleton-base)',
              borderRadius: '4px'
            }} className="skeleton" />
          </div>
          
          {/* Search Controls Skeleton */}
          <SearchSkeleton />
        </div>

        {/* Content Skeleton */}
        <MemoGridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <div>
            <p className="text-secondary" style={{ margin: 0 }}>
              {memos.length > 0 ? `${memos.length}件のメモ` : 'まだメモがありません'}
            </p>
          </div>
          
          {memos.length === 0 && (
            <Link to="/memo/new" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
              <svg 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2"
                style={{ marginRight: '0.5rem' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              最初のメモを作成
            </Link>
          )}
        </div>
        
        {/* Search and Sort Controls */}
        {memos.length > 0 && (
          <div>
            <AdvancedSearchPanel
              filters={filters}
              allTags={allTags}
              onSearchTermChange={updateSearchTerm}
              onToggleTag={toggleTag}
              onToggleType={toggleType}
              onImageFilterChange={setImageFilter}
              onDateRangeChange={setDateRange}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              sortSettings={sortSettings}
              onSort={updateSort}
              getSortLabel={getSortLabel}
            />
          </div>
        )}
      </div>

      {/* Content */}
      {memos.length === 0 ? (
        // Empty State
        <div className="card" style={{ 
          padding: '3rem 2rem', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--background) 100%)',
          border: '2px dashed var(--border)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* メインアイコン */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <svg 
              width="36" 
              height="36" 
              fill="none" 
              stroke="white" 
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            
            {/* キラキラエフェクト */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '8px',
              width: '16px',
              height: '16px',
              background: '#fbbf24',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}>✨</div>
          </div>
          
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700', 
            margin: '0 0 1rem 0',
            color: 'var(--text-primary)',
            lineHeight: '1.3'
          }}>
            あなたの思考を<br />整理しませんか？
          </h2>
          
          <p style={{ 
            margin: '0 0 2rem 0',
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            アイデア、思考、タスクを一箇所で管理。<br />
            タグで分類、検索で素早く見つけて、<br />
            生産性を向上させましょう。
          </p>

          {/* 機能リスト */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            margin: '2rem 0',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem auto'
              }}>
                <svg width="24" height="24" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M9 21h6"></path>
                  <path d="M9 18h6"></path>
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3 5.5v1.5h-8v-1.5c-1.5-1-3-3-3-5.5a7 7 0 0 1 7-7z"></path>
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                アイデア
              </p>
            </div>
            
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem auto'
              }}>
                <svg width="24" height="24" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                思考整理
              </p>
            </div>
            
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem auto'
              }}>
                <svg width="24" height="24" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" strokeWidth="2">
                  <polyline points="9,11 12,14 22,4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                タスク管理
              </p>
            </div>
          </div>

          {/* アクションボタン */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <Link 
              to="/memo/new" 
              className="btn btn-primary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                transform: 'translateY(0)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
                e.currentTarget.classList.add('glow');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.classList.remove('glow');
              }}
            >
              📝 最初のメモを作成
            </Link>
          </div>

          {/* ヒント */}
          <div style={{
            marginTop: '3rem',
            padding: '1.5rem',
            background: 'var(--primary-light)',
            borderRadius: '12px',
            border: `1px solid var(--border)`,
            textAlign: 'left'
          }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="16" height="16" fill="none" stroke="var(--primary)" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              使い方のヒント
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '1.25rem',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              <li>テキストや画像を追加してメモを作成</li>
              <li>タグを付けて分類・整理</li>
              <li>検索機能で素早く目的のメモを発見</li>
              <li>ピン留めで重要なメモを上部に固定</li>
            </ul>
          </div>
        </div>
      ) : filteredMemos.length === 0 ? (
        // No Search Results
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="text-secondary">
            {hasActiveFilters 
              ? 'フィルター条件に一致するメモが見つかりません'
              : `「${filters.searchTerm}」に一致するメモが見つかりません`
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
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
      ) : (
        // Memo Grid
        <div className="grid-responsive">
          {filteredMemos.map((memo, index) => (
            <div 
              key={memo.id} 
              className="card memo-card fade-in-up" 
              tabIndex={0}
              role="article"
              aria-labelledby={`memo-title-${memo.id}`}
              aria-describedby={`memo-content-${memo.id}`}
              style={{ 
                padding: '1.5rem',
                border: memo.isPinned ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: memo.isPinned ? 'var(--primary-light)' : 'var(--surface)',
                borderLeft: `4px solid ${
                  memo.type === 'note' ? '#10B981' : 
                  memo.type === 'wiki' ? '#F59E0B' : 
                  '#3B82F6'
                }`,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'both'
              }}
              onClick={(e) => {
                // 編集・削除・ピン留めボタンのクリックは無視
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('a')) {
                  return;
                }
                navigate(`/memo/${memo.id}`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/memo/${memo.id}`);
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-focus)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Images Preview or Placeholder */}
              {memo.images && memo.images.length > 0 ? (
                <div style={{ marginBottom: '1rem' }}>
                  {memo.images.length === 1 ? (
                    // Single image
                    <div style={{ position: 'relative' }}>
                      <img
                        src={memo.images[0]}
                        alt={memo.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--border)'
                        }}
                      />
                    </div>
                  ) : (
                    // Multiple images
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: (memo.images?.length || 0) === 2 ? '1fr 1fr' : 'repeat(2, 1fr)',
                      gap: '0.5rem',
                      position: 'relative'
                    }}>
                      {memo.images.slice(0, 4).map((image, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img
                            src={image}
                            alt={`${memo.title} - 画像 ${index + 1}`}
                            style={{
                              width: '100%',
                              height: (memo.images?.length || 0) === 2 ? '150px' : '100px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid var(--border)'
                            }}
                          />
                          {/* Show "+X more" overlay for 4th image if there are more */}
                          {index === 3 && (memo.images?.length || 0) > 4 && (
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'rgba(0, 0, 0, 0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              borderRadius: '4px'
                            }}>
                              +{(memo.images?.length || 0) - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Type-based placeholder
                <div style={{ 
                  marginBottom: '1rem',
                  height: '140px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: `linear-gradient(135deg, ${
                    memo.type === 'note' ? 'rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%' :
                    memo.type === 'wiki' ? 'rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%' :
                    'rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%'
                  })`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Background pattern */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.03,
                    backgroundImage: `radial-gradient(circle at 20% 50%, ${
                      memo.type === 'note' ? '#10B981' :
                      memo.type === 'wiki' ? '#F59E0B' :
                      '#3B82F6'
                    } 2px, transparent 2px), radial-gradient(circle at 80% 50%, ${
                      memo.type === 'note' ? '#10B981' :
                      memo.type === 'wiki' ? '#F59E0B' :
                      '#3B82F6'
                    } 2px, transparent 2px)`,
                    backgroundSize: '50px 50px'
                  }} />
                  
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${
                      memo.type === 'note' ? '#10B981 0%, #059669 100%' :
                      memo.type === 'wiki' ? '#F59E0B 0%, #D97706 100%' :
                      '#3B82F6 0%, #2563EB 100%'
                    })`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: `0 4px 12px rgba(${
                      memo.type === 'note' ? '16, 185, 129' :
                      memo.type === 'wiki' ? '245, 158, 11' :
                      '59, 130, 246'
                    }, 0.3)`
                  }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      {memo.type === 'note' ? (
                        // Note icon
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .708A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                      ) : memo.type === 'wiki' ? (
                        // Wiki icon
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      ) : (
                        // Memo icon
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-16.5H6a2.25 2.25 0 00-2.25 2.25v16.5A2.25 2.25 0 006 22.5h12a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      )}
                    </svg>
                  </div>
                  
                  {/* Type label */}
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: `${
                      memo.type === 'note' ? '#10B981' :
                      memo.type === 'wiki' ? '#F59E0B' :
                      '#3B82F6'
                    }`,
                    letterSpacing: '0.025em'
                  }}>
                    {memo.type === 'note' ? 'ノート' :
                     memo.type === 'wiki' ? 'Wiki記事' :
                     'メモ'}
                  </div>
                  
                  {/* Subtle subtitle */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center'
                  }}>
                    画像なし
                  </div>
                </div>
              )}
              
              {/* Memo Content */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                flex: 1,
                minHeight: 0
              }}>
                {/* Header section */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      flex: 1 
                    }}>
                      {/* Type Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: memo.type === 'note' ? '#10B981' : 
                                   memo.type === 'wiki' ? '#F59E0B' : 
                                   '#3B82F6',
                        color: 'white'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        }}></div>
                        {memo.type === 'note' ? 'ノート' : 
                         memo.type === 'wiki' ? 'Wiki' : 
                         'メモ'}
                      </div>
                      
                      <h3 
                        id={`memo-title-${memo.id}`}
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '600',
                          margin: 0,
                          color: 'var(--text-primary)',
                          lineHeight: '1.5',
                          wordBreak: 'break-word',
                          flex: 1
                        }}
                      >
                        {memo.title}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => togglePinMemo(memo.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        marginLeft: '0.5rem',
                        borderRadius: '4px',
                        color: memo.isPinned ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--surface-hover)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title={memo.isPinned ? 'ピン留めを解除' : 'ピン留めする'}
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        {memo.isPinned ? (
                          // ピン留め済み（塗りつぶしピン）
                          <path d="M16 4v4c0 1.1-.9 2-2 2h-1v6l-1 1-1-1v-6H9c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h5c1.1 0 2 .9 2 2z"/>
                        ) : (
                          // ピン留めなし（アウトラインピン）
                          <path d="M16 4v4c0 1.1-.9 2-2 2h-1v6l-1 1-1-1v-6H9c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h5c1.1 0 2 .9 2 2zm-2 0H9v4h5V4z"/>
                        )}
                      </svg>
                    </button>
                  </div>
                  
                  {memo.content && (
                    <p 
                      id={`memo-content-${memo.id}`}
                      className="text-secondary truncate-2" 
                      style={{ 
                        margin: 0, 
                        fontSize: '0.875rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {memo.content}
                    </p>
                  )}
                </div>
                
                {/* Tags section */}
                {memo.tags.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {memo.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Spacer to push footer to bottom */}
                <div style={{ flex: 1 }}></div>
                
                {/* Fixed footer at bottom */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border)',
                  marginTop: 'auto'
                }}>
                  <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                    {formatDate(memo.createdAt)}
                    {memo.updatedAt !== memo.createdAt && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        (編集済み)
                      </span>
                    )}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      to={`/memo/edit/${memo.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(memo.id, memo.title)}
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        color: 'var(--error)',
                        borderColor: 'color-mix(in srgb, var(--error) 30%, transparent)'
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* FAB for adding new memo when memos exist */}
      {memos.length > 0 && (
        <Link 
          to="/memo/new"
          className="float"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '56px',
            height: '56px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            color: 'white',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15) translateY(-2px)';
            e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
            e.currentTarget.style.animation = 'none'; // Stop floating on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            e.currentTarget.style.animation = 'float 3s ease-in-out infinite'; // Resume floating
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
      
      {/* Stats */}
      {memos.length > 0 && (
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--surface)',
          borderRadius: '6px',
          border: '1px solid var(--border)'
        }}>
          <span className="text-muted" style={{ fontSize: '0.875rem' }}>
            総メモ数: {memos.length}
            {memos.filter(m => m.isPinned).length > 0 && (
              <span style={{ marginLeft: '1rem' }}>
                ピン留め: {memos.filter(m => m.isPinned).length}
              </span>
            )}
            {(hasActiveFilters || filters.searchTerm) && filteredMemos.length !== memos.length && (
              <span style={{ marginLeft: '1rem' }}>
                表示中: {filteredMemos.length}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export default Home;