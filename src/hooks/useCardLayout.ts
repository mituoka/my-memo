import { useState, useEffect } from 'react';
import type { CardLayout, CardLayoutSettings } from '@/types';

const CARD_LAYOUT_STORAGE_KEY = 'memo_card_layout_settings';

const DEFAULT_CARD_LAYOUT: CardLayoutSettings = {
  layout: 'default'
};

export const useCardLayout = () => {
  const [cardLayoutSettings, setCardLayoutSettings] = useState<CardLayoutSettings>(DEFAULT_CARD_LAYOUT);

  useEffect(() => {
    const saved = localStorage.getItem(CARD_LAYOUT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCardLayoutSettings({ ...DEFAULT_CARD_LAYOUT, ...parsed });
      } catch (error) {
        console.error('Failed to parse card layout settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CARD_LAYOUT_STORAGE_KEY, JSON.stringify(cardLayoutSettings));
  }, [cardLayoutSettings]);

  const setCardLayout = (layout: CardLayout) => {
    setCardLayoutSettings(prev => ({
      ...prev,
      layout
    }));
  };

  const getCardLayoutLabel = (layout: CardLayout): string => {
    switch (layout) {
      case 'default': return 'デフォルト';
      case 'compact': return 'コンパクト';
      case 'detailed': return '詳細表示';
      case 'minimal': return 'ミニマル';
      default: return 'デフォルト';
    }
  };

  const getCardLayoutDescription = (layout: CardLayout): string => {
    switch (layout) {
      case 'default': return '標準的なカードレイアウト';
      case 'compact': return '情報を圧縮した密度の高いレイアウト';
      case 'detailed': return 'より多くの情報を表示する詳細レイアウト';
      case 'minimal': return 'シンプルで最小限の情報のみ表示';
      default: return '標準的なカードレイアウト';
    }
  };

  return {
    cardLayoutSettings,
    setCardLayout,
    getCardLayoutLabel,
    getCardLayoutDescription
  };
};