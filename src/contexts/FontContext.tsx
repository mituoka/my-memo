import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontOption = {
  id: string;
  name: string;
  fontFamily: string;
  description: string;
};

const FONT_OPTIONS: FontOption[] = [
  {
    id: 'hiragino',
    name: 'ヒラギノ角ゴ',
    fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "BIZ UDPGothic", "Meiryo", "Yu Gothic Medium", "Yu Gothic", "Segoe UI", "Noto Sans CJK JP", -apple-system, BlinkMacSystemFont, sans-serif',
    description: 'macOSの標準日本語フォント（推奨）'
  },
  {
    id: 'yugothic',
    name: '游ゴシック',
    fontFamily: '"Yu Gothic Medium", "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", "BIZ UDPGothic", sans-serif',
    description: 'Windows/macOS標準の美しい日本語フォント'
  },
  {
    id: 'bizud',
    name: 'BIZ UDPゴシック',
    fontFamily: '"BIZ UDPGothic", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif',
    description: 'ユニバーサルデザインフォント'
  },
  {
    id: 'noto',
    name: 'Noto Sans CJK',
    fontFamily: '"Noto Sans CJK JP", "Hiragino Sans", "Yu Gothic", sans-serif',
    description: 'Googleの多言語対応フォント'
  },
  {
    id: 'meiryo',
    name: 'メイリオ',
    fontFamily: '"Meiryo", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
    description: 'Windows標準の読みやすいフォント'
  },
  {
    id: 'system',
    name: 'システムデフォルト',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    description: 'OSの標準フォント'
  }
];

type FontContextType = {
  currentFont: FontOption;
  setFont: (fontId: string) => void;
  fontOptions: FontOption[];
};

const FontContext = createContext<FontContextType | undefined>(undefined);

const STORAGE_KEY = 'my_memo_app_font_setting';

type FontProviderProps = {
  children: ReactNode;
};

export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const [currentFont, setCurrentFont] = useState<FontOption>(FONT_OPTIONS[0]);

  useEffect(() => {
    const savedFontId = localStorage.getItem(STORAGE_KEY);
    if (savedFontId) {
      const savedFont = FONT_OPTIONS.find(font => font.id === savedFontId);
      if (savedFont) {
        setCurrentFont(savedFont);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', currentFont.fontFamily);
  }, [currentFont]);

  const setFont = (fontId: string) => {
    const font = FONT_OPTIONS.find(f => f.id === fontId);
    if (font) {
      setCurrentFont(font);
      localStorage.setItem(STORAGE_KEY, fontId);
    }
  };

  return (
    <FontContext.Provider value={{
      currentFont,
      setFont,
      fontOptions: FONT_OPTIONS
    }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};