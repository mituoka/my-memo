import React, { useState } from 'react';
import type { SearchFilters } from '../hooks/useAdvancedSearch';
import type { SortSettings, SortField } from '@/types';

interface AdvancedSearchPanelProps {
  readonly filters: SearchFilters;
  readonly allTags: readonly string[];
  readonly onSearchTermChange: (term: string) => void;
  readonly onToggleTag: (tag: string) => void;
  readonly onImageFilterChange: (hasImages: boolean | null) => void;
  readonly onDateRangeChange: (start: string, end: string) => void;
  readonly onClearFilters: () => void;
  readonly hasActiveFilters: boolean;
  readonly sortSettings: SortSettings;
  readonly onSort: (field: SortField) => void;
  readonly getSortLabel: (field: SortField) => string;
}

export const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  filters,
  allTags,
  onSearchTermChange,
  onToggleTag,
  onImageFilterChange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
  sortSettings,
  onSort,
  getSortLabel
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
            <span style={{
              background: sortSettings.field ? 'var(--primary)' : 'var(--text-muted)',
              color: 'white',
              fontSize: '0.75rem',
              padding: '0.125rem 0.375rem',
              borderRadius: '10px',
              minWidth: '1rem',
              textAlign: 'center'
            }}>
              {getSortLabel(sortSettings.field).charAt(0)}
            </span>
          </button>

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
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {['updatedAt', 'createdAt', 'title'].map(field => {
              const sortField = field as SortField;
              const getSortIcon = (field: SortField) => {
                const iconStyle = {
                  width: '16px',
                  height: '16px',
                  flexShrink: 0
                };

                if (sortSettings.field !== field) {
                  return (
                    <svg style={{ ...iconStyle, opacity: 0.3 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  );
                }

                if (sortSettings.order === 'asc') {
                  return (
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  );
                }

                return (
                  <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                );
              };

              return (
                <button
                  key={field}
                  onClick={() => {
                    onSort(sortField);
                    setIsSortExpanded(false); // 選択後に閉じる
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: sortSettings.field === sortField ? 'var(--primary)' : 'var(--surface)',
                    color: sortSettings.field === sortField ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    minHeight: '44px',
                    flex: '1 1 0',
                    minWidth: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    if (sortSettings.field !== sortField) {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sortSettings.field !== sortField) {
                      e.currentTarget.style.background = 'var(--surface)';
                    }
                  }}
                >
                  <span style={{ lineHeight: 1 }}>{getSortLabel(sortField)}</span>
                  {getSortIcon(sortField)}
                </button>
              );
            })}
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