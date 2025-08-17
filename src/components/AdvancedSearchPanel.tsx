import React, { useState } from 'react';
import type { SearchFilters } from '../hooks/useAdvancedSearch';
import type { SortSettings, SortField, MemoType, ViewSettings, ViewMode, CardLayoutSettings, CardLayout } from '@/types';
import { CardLayoutSettings as CardLayoutSettingsComponent } from './CardLayoutSettings';

interface AdvancedSearchPanelProps {
  readonly filters: SearchFilters;
  readonly allTags: readonly string[];
  readonly onSearchTermChange: (term: string) => void;
  readonly onToggleTag: (tag: string) => void;
  readonly onToggleType: (type: MemoType) => void;
  readonly onImageFilterChange: (hasImages: boolean | null) => void;
  readonly onDateRangeChange: (start: string, end: string) => void;
  readonly onClearFilters: () => void;
  readonly hasActiveFilters: boolean;
  readonly sortSettings: SortSettings;
  readonly onSort: (field: SortField) => void;
  readonly getSortLabel: (field: SortField) => string;
  readonly viewSettings: ViewSettings;
  readonly onViewModeChange: (mode: ViewMode) => void;
  readonly cardLayoutSettings: CardLayoutSettings;
  readonly onCardLayoutChange: (layout: CardLayout) => void;
  readonly getCardLayoutLabel: (layout: CardLayout) => string;
  readonly getCardLayoutDescription: (layout: CardLayout) => string;
}

export const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  filters,
  allTags,
  onSearchTermChange,
  onToggleTag,
  onToggleType,
  onImageFilterChange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
  sortSettings,
  onSort,
  getSortLabel,
  viewSettings,
  onViewModeChange,
  cardLayoutSettings,
  onCardLayoutChange,
  getCardLayoutLabel,
  getCardLayoutDescription
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSortExpanded, setIsSortExpanded] = useState(false);
  const [startDate, setStartDate] = useState(filters.dateRange?.start || '');
  const [endDate, setEndDate] = useState(filters.dateRange?.end || '');

  const handleDateRangeSubmit = () => {
    onDateRangeChange(startDate, endDate);
  };


  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '8px',
      background: 'var(--surface)',
      marginBottom: '1rem'
    }}>
      {/* Basic Search */}
      <div style={{ padding: '1rem' }}>
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="メモを検索..."
            value={filters.searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="input"
            style={{ paddingRight: '2.5rem' }}
          />
          <svg
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: 'var(--text-muted)'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        {/* モバイル対応のレスポンシブレイアウト */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {/* 詳細検索ボタン */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={isExpanded ? 'bounce-in' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--background)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isExpanded ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
            </svg>
            詳細検索
            {hasActiveFilters && !isExpanded && (
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.75rem',
                padding: '0.125rem 0.375rem',
                borderRadius: '10px',
                minWidth: '1rem',
                textAlign: 'center'
              }}>
                ●
              </span>
            )}
          </button>

          {/* 並び替えボタン */}
          <button
            onClick={() => setIsSortExpanded(!isSortExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--background)';
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isSortExpanded ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
            </svg>
            並び替え
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: sortSettings.field ? 'var(--primary)' : 'var(--text-muted)',
              color: 'white',
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              whiteSpace: 'nowrap'
            }}>
              <span>{getSortLabel(sortSettings.field)}</span>
              {sortSettings.field && (
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d={sortSettings.order === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              )}
            </div>
          </button>

          {/* 表示形式切り替えボタン */}
          <div style={{
            display: 'flex',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <button
              onClick={() => onViewModeChange('grid-2')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                border: 'none',
                background: viewSettings.mode === 'grid-2' ? 'var(--primary)' : 'var(--background)',
                color: viewSettings.mode === 'grid-2' ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '44px'
              }}
              onMouseEnter={(e) => {
                if (viewSettings.mode !== 'grid-2') {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewSettings.mode !== 'grid-2') {
                  e.currentTarget.style.background = 'var(--background)';
                }
              }}
              title="2列グリッド表示"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('grid-3')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                border: 'none',
                background: viewSettings.mode === 'grid-3' ? 'var(--primary)' : 'var(--background)',
                color: viewSettings.mode === 'grid-3' ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '44px'
              }}
              onMouseEnter={(e) => {
                if (viewSettings.mode !== 'grid-3') {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewSettings.mode !== 'grid-3') {
                  e.currentTarget.style.background = 'var(--background)';
                }
              }}
              title="3列グリッド表示"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="3" y="3" width="5" height="5"></rect>
                <rect x="10" y="3" width="4" height="5"></rect>
                <rect x="16" y="3" width="5" height="5"></rect>
                <rect x="3" y="10" width="5" height="5"></rect>
                <rect x="10" y="10" width="4" height="5"></rect>
                <rect x="16" y="10" width="5" height="5"></rect>
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                border: 'none',
                background: viewSettings.mode === 'list' ? 'var(--primary)' : 'var(--background)',
                color: viewSettings.mode === 'list' ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '44px'
              }}
              onMouseEnter={(e) => {
                if (viewSettings.mode !== 'list') {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewSettings.mode !== 'list') {
                  e.currentTarget.style.background = 'var(--background)';
                }
              }}
              title="リスト表示"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* カードレイアウト設定 */}
          <CardLayoutSettingsComponent
            cardLayoutSettings={cardLayoutSettings}
            onCardLayoutChange={onCardLayoutChange}
            getCardLayoutLabel={getCardLayoutLabel}
            getCardLayoutDescription={getCardLayoutDescription}
          />

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                border: '1px solid var(--error)',
                borderRadius: '6px',
                background: 'none',
                color: 'var(--error)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--error)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = 'var(--error)';
              }}
            >
              クリア
            </button>
          )}
        </div>
      </div>

      {/* Sort Options */}
      {isSortExpanded && (
        <div 
          className="slide-in-right"
          style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem',
            background: 'var(--background)'
          }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            margin: '0 0 0.75rem 0',
            color: 'var(--text-primary)'
          }}>
            並び替え
          </h4>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            {['updatedAt', 'createdAt', 'title'].map(field => {
              const sortField = field as SortField;
              const isActive = sortSettings.field === sortField;
              const isAscending = isActive && sortSettings.order === 'asc';

              return (
                <button
                  key={field}
                  onClick={() => {
                    onSort(sortField);
                    // 同じフィールドをもう一度クリックしても閉じないように変更
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.875rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    background: isActive ? 'var(--primary)' : 'var(--surface)',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    minHeight: '48px',
                    flex: '1 1 0',
                    minWidth: 'fit-content',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--surface)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: '0.125rem'
                  }}>
                    <span style={{ lineHeight: 1, fontWeight: '600' }}>
                      {getSortLabel(sortField)}
                    </span>
                    {isActive && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        opacity: 0.9,
                        fontWeight: '400'
                      }}>
                        {field === 'title' 
                        ? (isAscending ? '昇順 (A→Z)' : '降順 (Z→A)')
                        : (isAscending ? '昇順 (古い順)' : '降順 (新しい順)')
                      }
                      </span>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--surface)',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--border)'
                  }}>
                    {!isActive ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ opacity: 0.5 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    ) : isAscending ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Instructions */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'var(--primary-light)',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="16" height="16" fill="none" stroke="var(--primary)" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>並び替え項目をクリックして昇順・降順を切り替えられます</span>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {isExpanded && (
        <div 
          className="slide-in-left"
          style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem',
            background: 'var(--background)'
          }}>
          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                margin: '0 0 0.75rem 0',
                color: 'var(--text-primary)'
              }}>
                タグで絞り込み
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onToggleTag(tag)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.875rem',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      background: filters.selectedTags.includes(tag) 
                        ? 'var(--primary)' 
                        : 'var(--surface)',
                      color: filters.selectedTags.includes(tag) 
                        ? 'white' 
                        : 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!filters.selectedTags.includes(tag)) {
                        e.currentTarget.style.background = 'var(--surface-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!filters.selectedTags.includes(tag)) {
                        e.currentTarget.style.background = 'var(--surface)';
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              margin: '0 0 0.75rem 0',
              color: 'var(--text-primary)'
            }}>
              タイプで絞り込み
            </h4>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {(['memo', 'note', 'wiki'] as MemoType[]).map(type => (
                <button
                  key={type}
                  onClick={() => onToggleType(type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    background: filters.selectedTypes.includes(type) 
                      ? 'var(--primary)' 
                      : 'var(--surface)',
                    color: filters.selectedTypes.includes(type) 
                      ? 'white' 
                      : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!filters.selectedTypes.includes(type)) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!filters.selectedTypes.includes(type)) {
                      e.currentTarget.style.background = 'var(--surface)';
                    }
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: type === 'memo' ? '#3B82F6' : type === 'note' ? '#10B981' : '#F59E0B'
                  }}></div>
                  {type === 'memo' ? 'メモ' : type === 'note' ? 'ノート' : 'Wiki'}
                </button>
              ))}
            </div>
          </div>

          {/* Image Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              margin: '0 0 0.75rem 0',
              color: 'var(--text-primary)'
            }}>
              画像
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { value: null, label: '全て' },
                { value: true, label: '画像あり' },
                { value: false, label: '画像なし' }
              ].map(option => (
                <button
                  key={String(option.value)}
                  onClick={() => onImageFilterChange(option.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: filters.hasImages === option.value 
                      ? 'var(--primary)' 
                      : 'var(--surface)',
                    color: filters.hasImages === option.value 
                      ? 'white' 
                      : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (filters.hasImages !== option.value) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filters.hasImages !== option.value) {
                      e.currentTarget.style.background = 'var(--surface)';
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              margin: '0 0 0.75rem 0',
              color: 'var(--text-primary)'
            }}>
              作成日時
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
                style={{ fontSize: '0.875rem' }}
              />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>〜</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input"
                style={{ fontSize: '0.875rem' }}
              />
              <button
                onClick={handleDateRangeSubmit}
                disabled={!startDate || !endDate}
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  border: '1px solid var(--primary)',
                  borderRadius: '6px',
                  background: startDate && endDate ? 'var(--primary)' : 'var(--surface)',
                  color: startDate && endDate ? 'white' : 'var(--text-muted)',
                  cursor: startDate && endDate ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                適用
              </button>
            </div>
            {filters.dateRange && (
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)'
              }}>
                📅 {new Date(filters.dateRange.start).toLocaleDateString('ja-JP')} 〜 {new Date(filters.dateRange.end).toLocaleDateString('ja-JP')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};