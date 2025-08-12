import { useState, useEffect, useMemo } from 'react';
import type { Memo, SortSettings, SortField, SortOrder } from '@/types';

const SORT_STORAGE_KEY = 'memo_sort_settings';

const DEFAULT_SORT: SortSettings = {
  field: 'updatedAt',
  order: 'desc'
};

export const useMemoSort = (memos: readonly Memo[]) => {
  const [sortSettings, setSortSettings] = useState<SortSettings>(DEFAULT_SORT);

  useEffect(() => {
    const saved = localStorage.getItem(SORT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSortSettings({ ...DEFAULT_SORT, ...parsed });
      } catch (error) {
        console.error('Failed to parse sort settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sortSettings));
  }, [sortSettings]);

  const sortedMemos = useMemo(() => {
    const sorted = [...memos].sort((a, b) => {
      // ピン留めメモを最優先
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      let comparison = 0;
      
      switch (sortSettings.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ja');
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          return 0;
      }

      return sortSettings.order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [memos, sortSettings]);

  const updateSort = (field: SortField, order?: SortOrder) => {
    setSortSettings(prev => ({
      field,
      order: order || (prev.field === field && prev.order === 'desc' ? 'asc' : 'desc')
    }));
  };

  const getSortLabel = (field: SortField): string => {
    switch (field) {
      case 'title': return 'タイトル';
      case 'createdAt': return '作成日時';
      case 'updatedAt': return '更新日時';
      default: return '';
    }
  };

  return {
    sortedMemos,
    sortSettings,
    updateSort,
    getSortLabel
  };
};