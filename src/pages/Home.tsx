import React from 'react';
import { MemoGridSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from './Home/components/EmptyState';
import { HomeHeader } from './Home/components/HomeHeader';
import { MemoGrid } from './Home/components/MemoGrid';
import { useHomePage } from './Home/hooks/useHomePage';

function Home() {
  const {
    memos,
    finalMemos,
    isLoaded,
    filters,
    allTags,
    hasActiveFilters,
    updateSearchTerm,
    toggleTag,
    toggleType,
    setImageFilter,
    setDateRange,
    clearFilters,
    sortSettings,
    updateSort,
    getSortLabel,
    viewSettings,
    setViewMode,
    cardLayoutSettings,
    setCardLayout,
    getCardLayoutLabel,
    getCardLayoutDescription,
    deleteMemo,
    togglePinMemo
  } = useHomePage();

  // ローディング中
  if (!isLoaded) {
    return (
      <div>
        <HomeHeader
          isLoaded={false}
          memosCount={0}
          filters={filters}
          allTags={allTags}
          sortSettings={sortSettings}
          viewSettings={viewSettings}
          cardLayoutSettings={cardLayoutSettings}
          hasActiveFilters={hasActiveFilters}
          onSearchTermChange={updateSearchTerm}
          onToggleTag={toggleTag}
          onToggleType={toggleType}
          onImageFilterChange={setImageFilter}
          onDateRangeChange={setDateRange}
          onClearFilters={clearFilters}
          onSort={updateSort}
          getSortLabel={getSortLabel}
          onViewModeChange={setViewMode}
          onCardLayoutChange={setCardLayout}
          getCardLayoutLabel={getCardLayoutLabel}
          getCardLayoutDescription={getCardLayoutDescription}
        />
        <MemoGridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div>
      {/* ヘッダー部分 */}
      <HomeHeader
        isLoaded={isLoaded}
        memosCount={memos.length}
        filters={filters}
        allTags={allTags}
        sortSettings={sortSettings}
        viewSettings={viewSettings}
        cardLayoutSettings={cardLayoutSettings}
        hasActiveFilters={hasActiveFilters}
        onSearchTermChange={updateSearchTerm}
        onToggleTag={toggleTag}
        onToggleType={toggleType}
        onImageFilterChange={setImageFilter}
        onDateRangeChange={setDateRange}
        onClearFilters={clearFilters}
        onSort={updateSort}
        getSortLabel={getSortLabel}
        onViewModeChange={setViewMode}
        onCardLayoutChange={setCardLayout}
        getCardLayoutLabel={getCardLayoutLabel}
        getCardLayoutDescription={getCardLayoutDescription}
      />

      {/* コンテンツ部分 */}
      {memos.length === 0 ? (
        <EmptyState />
      ) : (
        <MemoGrid
          memos={finalMemos}
          hasActiveFilters={hasActiveFilters}
          searchTerm={filters.searchTerm}
          viewSettings={viewSettings}
          cardLayoutSettings={cardLayoutSettings}
          onDeleteMemo={deleteMemo}
          onTogglePin={togglePinMemo}
          onClearFilters={clearFilters}
        />
      )}
    </div>
  );
}

export default Home;