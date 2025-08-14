import { useState, useMemo } from 'react';
import type { Memo, MemoType } from '@/types';

export interface SearchFilters {
  searchTerm: string;
  selectedTags: string[];
  hasImages: boolean | null; // null = all, true = with images, false = without images
  selectedTypes: MemoType[]; // empty array = all types
  dateRange: {
    start: string;
    end: string;
  } | null;
}

const DEFAULT_FILTERS: SearchFilters = {
  searchTerm: '',
  selectedTags: [],
  hasImages: null,
  selectedTypes: [],
  dateRange: null
};

export const useAdvancedSearch = (memos: readonly Memo[]) => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    memos.forEach(memo => {
      memo.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [memos]);

  const filteredMemos = useMemo(() => {
    return memos.filter(memo => {
      // テキスト検索
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesText = 
          memo.title.toLowerCase().includes(searchTerm) ||
          memo.content.toLowerCase().includes(searchTerm) ||
          memo.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        if (!matchesText) return false;
      }

      // タグフィルター
      if (filters.selectedTags.length > 0) {
        const hasSelectedTag = filters.selectedTags.some(selectedTag =>
          memo.tags.includes(selectedTag)
        );
        if (!hasSelectedTag) return false;
      }

      // タイプフィルター
      if (filters.selectedTypes.length > 0) {
        const memoType = memo.type || 'memo';
        if (!filters.selectedTypes.includes(memoType)) return false;
      }

      // 画像フィルター
      if (filters.hasImages !== null) {
        const hasImages = memo.images && memo.images.length > 0;
        if (filters.hasImages && !hasImages) return false;
        if (!filters.hasImages && hasImages) return false;
      }

      // 日付範囲フィルター
      if (filters.dateRange) {
        const memoDate = new Date(memo.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999); // 終日を含める

        if (memoDate < startDate || memoDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [memos, filters]);

  const updateSearchTerm = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const toggleType = (type: MemoType) => {
    setFilters(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter(t => t !== type)
        : [...prev.selectedTypes, type]
    }));
  };

  const setImageFilter = (hasImages: boolean | null) => {
    setFilters(prev => ({ ...prev, hasImages }));
  };

  const setDateRange = (start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: start && end ? { start, end } : null
    }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = Boolean(
    filters.searchTerm ||
    filters.selectedTags.length > 0 ||
    filters.selectedTypes.length > 0 ||
    filters.hasImages !== null ||
    filters.dateRange
  );

  return {
    filters,
    filteredMemos,
    allTags,
    updateSearchTerm,
    toggleTag,
    toggleType,
    setImageFilter,
    setDateRange,
    clearFilters,
    hasActiveFilters
  };
};