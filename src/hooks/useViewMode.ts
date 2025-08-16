import { useState, useEffect } from 'react';
import type { ViewMode, ViewSettings } from '@/types';

const VIEW_STORAGE_KEY = 'memo_view_settings';

const DEFAULT_VIEW: ViewSettings = {
  mode: 'grid-2'
};

export const useViewMode = () => {
  const [viewSettings, setViewSettings] = useState<ViewSettings>(DEFAULT_VIEW);

  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setViewSettings({ ...DEFAULT_VIEW, ...parsed });
      } catch (error) {
        console.error('Failed to parse view settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(viewSettings));
  }, [viewSettings]);

  const toggleViewMode = () => {
    setViewSettings(prev => {
      let nextMode: ViewMode;
      switch (prev.mode) {
        case 'grid-2':
          nextMode = 'grid-3';
          break;
        case 'grid-3':
          nextMode = 'list';
          break;
        case 'list':
          nextMode = 'grid-2';
          break;
        default:
          nextMode = 'grid-2';
      }
      return { ...prev, mode: nextMode };
    });
  };

  const setViewMode = (mode: ViewMode) => {
    setViewSettings(prev => ({
      ...prev,
      mode
    }));
  };

  return {
    viewSettings,
    toggleViewMode,
    setViewMode
  };
};