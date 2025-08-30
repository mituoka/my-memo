import React from 'react';
import { Link } from 'react-router-dom';
import { AdvancedSearchPanel } from '../../../components/AdvancedSearchPanel';
import { SearchSkeleton } from '../../../components/common/SkeletonLoader';
import { MemoType, SortSettings, ViewSettings, CardLayoutSettings } from '../../../types';

interface HomeHeaderProps {
  readonly isLoaded: boolean;
  readonly memosCount: number;
  readonly filters: any;
  readonly allTags: readonly string[];
  readonly sortSettings: SortSettings;
  readonly viewSettings: ViewSettings;
  readonly cardLayoutSettings: CardLayoutSettings;
  readonly hasActiveFilters: boolean;
  readonly onSearchTermChange: (term: string) => void;
  readonly onToggleTag: (tag: string) => void;
  readonly onToggleType: (type: MemoType) => void;
  readonly onImageFilterChange: (hasImages: boolean | null) => void;
  readonly onDateRangeChange: (start: string, end: string) => void;
  readonly onClearFilters: () => void;
  readonly onSort: (field: any, direction?: any) => void;
  readonly getSortLabel: (field: any) => string;
  readonly onViewModeChange: (mode: any) => void;
  readonly onCardLayoutChange: (layout: any) => void;
  readonly getCardLayoutLabel: (layout: any) => string;
  readonly getCardLayoutDescription: (layout: any) => string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  isLoaded,
  memosCount,
  filters,
  allTags,
  sortSettings,
  viewSettings,
  cardLayoutSettings,
  hasActiveFilters,
  onSearchTermChange,
  onToggleTag,
  onToggleType,
  onImageFilterChange,
  onDateRangeChange,
  onClearFilters,
  onSort,
  getSortLabel,
  onViewModeChange,
  onCardLayoutChange,
  getCardLayoutLabel,
  getCardLayoutDescription
}) => {
  if (!isLoaded) {
    return (
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
        
        <SearchSkeleton />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* ヘッダー情報 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem' 
      }}>
        <div>
          <p className="text-secondary" style={{ margin: 0 }}>
            {memosCount > 0 ? `${memosCount}件のメモ` : 'まだメモがありません'}
          </p>
        </div>
        
        <Link 
          to="/memo/new" 
          className="btn btn-primary" 
          style={{ 
            fontSize: '0.875rem', 
            padding: memosCount === 0 ? '0.75rem 1.5rem' : '0.5rem 1rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {memosCount === 0 ? '最初のメモを作成' : '新規作成'}
        </Link>
      </div>
      
      {/* 検索・ソート・ビュー設定 */}
      {memosCount > 0 && (
        <div>
          <AdvancedSearchPanel
            filters={filters}
            allTags={allTags}
            onSearchTermChange={onSearchTermChange}
            onToggleTag={onToggleTag}
            onToggleType={onToggleType}
            onImageFilterChange={onImageFilterChange}
            onDateRangeChange={onDateRangeChange}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
            sortSettings={sortSettings}
            onSort={onSort}
            getSortLabel={getSortLabel}
            viewSettings={viewSettings}
            onViewModeChange={onViewModeChange}
            cardLayoutSettings={cardLayoutSettings}
            onCardLayoutChange={onCardLayoutChange}
            getCardLayoutLabel={getCardLayoutLabel}
            getCardLayoutDescription={getCardLayoutDescription}
          />
        </div>
      )}
    </div>
  );
};