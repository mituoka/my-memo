import { useMemo } from 'react';
import { useMemoStorage } from '../../../hooks/useMemoStorage';
import { useMemoSort } from '../../../hooks/useMemoSort';
import { useAdvancedSearch } from '../../../hooks/useAdvancedSearch';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import { useViewMode } from '../../../hooks/useViewMode';
import { useCardLayout } from '../../../hooks/useCardLayout';

export const useHomePage = () => {
  // 基本的なデータ取得
  const { memos, isLoaded, deleteMemo, togglePinMemo } = useMemoStorage();
  
  // ソート機能
  const { sortedMemos, sortSettings, updateSort, getSortLabel } = useMemoSort(memos);
  
  // 表示設定
  const { viewSettings, setViewMode } = useViewMode();
  const { cardLayoutSettings, setCardLayout, getCardLayoutLabel, getCardLayoutDescription } = useCardLayout();
  
  // 検索・フィルタリング機能
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

  // キーボードナビゲーション
  useKeyboardNavigation();

  // 最終的な表示用メモリスト
  const finalMemos = useMemo(() => {
    if (!isLoaded) return [];
    return searchFilteredMemos;
  }, [isLoaded, searchFilteredMemos]);

  return {
    // データ
    memos,
    finalMemos,
    isLoaded,
    
    // 検索・フィルター
    filters,
    allTags,
    hasActiveFilters,
    updateSearchTerm,
    toggleTag,
    toggleType,
    setImageFilter,
    setDateRange,
    clearFilters,
    
    // ソート
    sortSettings,
    updateSort,
    getSortLabel,
    
    // 表示設定
    viewSettings,
    setViewMode,
    cardLayoutSettings,
    setCardLayout,
    getCardLayoutLabel,
    getCardLayoutDescription,
    
    // アクション
    deleteMemo,
    togglePinMemo
  };
};