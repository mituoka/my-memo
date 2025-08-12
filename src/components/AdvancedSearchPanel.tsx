import React, { useState } from 'react';
import type { SearchFilters } from '../hooks/useAdvancedSearch';

interface AdvancedSearchPanelProps {
  readonly filters: SearchFilters;
  readonly allTags: readonly string[];
  readonly onSearchTermChange: (term: string) => void;
  readonly onToggleTag: (tag: string) => void;
  readonly onImageFilterChange: (hasImages: boolean | null) => void;
  readonly onDateRangeChange: (start: string, end: string) => void;
  readonly onClearFilters: () => void;
  readonly hasActiveFilters: boolean;
}

export const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  filters,
  allTags,
  onSearchTermChange,
  onToggleTag,
  onImageFilterChange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState(filters.dateRange?.start || '');
  const [endDate, setEndDate] = useState(filters.dateRange?.end || '');

  const handleDateRangeSubmit = () => {
    onDateRangeChange(startDate, endDate);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
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

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
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
              transition: 'all 0.2s ease'
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
                transition: 'all 0.2s ease'
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
              フィルターをクリア
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div style={{
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