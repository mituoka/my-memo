'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'custom';

type CustomColors = {
  primary: string;
  secondary: string;
  accent: string;
};

type ThemeContextType = {
  theme: Theme;
  customColors: CustomColors;
  isDarkMode: boolean; // 後方互換性のため保持
  setTheme: (theme: Theme) => void;
  setCustomColors: (colors: CustomColors) => void;
  toggleDarkMode: () => void; // 後方互換性のため保持
  backgroundImage: string | null;
  setBackgroundImage: (img: string | null) => void;
  backgroundOpacity: number;
  setBackgroundOpacity: (opacity: number) => void;
  backgroundBlur: number;
  setBackgroundBlur: (blur: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [customColors, setCustomColorsState] = useState<CustomColors>({
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#10b981'
  });
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacityState] = useState<number>(1);
  const [backgroundBlur, setBackgroundBlurState] = useState<number>(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // 初期化処理を関数化
  const initializeTheme = useCallback(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColors = localStorage.getItem('customColors');
    const savedBg = localStorage.getItem('backgroundImage');
    const savedOpacity = localStorage.getItem('backgroundOpacity');
    const savedBlur = localStorage.getItem('backgroundBlur');
    
    // カスタムカラーを最初に設定
    if (savedColors) {
      try {
        const parsedColors = JSON.parse(savedColors) as CustomColors;
        setCustomColorsState(parsedColors);
      } catch (e: unknown) {
        console.warn('Failed to parse custom colors from localStorage', e);
      }
    }
    
    if (savedBg) setBackgroundImageState(savedBg);
    if (savedOpacity) setBackgroundOpacityState(Number(savedOpacity));
    if (savedBlur) setBackgroundBlurState(Number(savedBlur));
    
    // デフォルトはライトモード（ブラウザ設定は無視）
    let initialTheme: Theme = 'light';
    if (savedTheme && ['light', 'dark', 'custom'].includes(savedTheme)) {
      initialTheme = savedTheme;
    }
    
    setThemeState(initialTheme);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    initializeTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // テーマが変更されたとき、またはハイドレーション後にテーマを適用
  useEffect(() => {
    if (isHydrated) {
      applyTheme(theme);
    }
  }, [theme, isHydrated]);
  // 背景画像・透過・ぼかし setter（useCallbackで最適化）
  const setBackgroundImage = useCallback((img: string | null) => {
    setBackgroundImageState(img);
    if (img) {
      localStorage.setItem('backgroundImage', img);
    } else {
      localStorage.removeItem('backgroundImage');
    }
  }, []);
  const setBackgroundOpacity = useCallback((opacity: number) => {
    setBackgroundOpacityState(opacity);
    localStorage.setItem('backgroundOpacity', String(opacity));
  }, []);
  const setBackgroundBlur = useCallback((blur: number) => {
    setBackgroundBlurState(blur);
    localStorage.setItem('backgroundBlur', String(blur));
  }, []);

  // カスタムカラーが変更されたときにテーマを再適用
  useEffect(() => {
    if (theme === 'custom') {
      applyTheme(theme);
    }
  }, [customColors, theme]);

  const applyTheme = useCallback((newTheme: Theme) => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;
    
    // 既存のテーマクラスを削除
    document.documentElement.classList.remove('light', 'dark', 'custom');
    
    // 新しいテーマクラスを適用（ブラウザ設定を上書きするため明示的にクラス追加）
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'custom') {
      document.documentElement.classList.add('custom');
      // カスタムカラーをCSS変数に設定
      const root = document.documentElement;
      root.style.setProperty('--custom-primary', customColors.primary);
      root.style.setProperty('--custom-secondary', customColors.secondary);
      root.style.setProperty('--custom-accent', customColors.accent);
    }
    
    // color-schemeメタ属性を強制的に設定してブラウザ設定を上書き
    const colorScheme = newTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.style.colorScheme = colorScheme;
    
    // メタタグも更新（ブラウザの自動スタイリングを制御）
    let metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (!metaColorScheme) {
      metaColorScheme = document.createElement('meta');
      metaColorScheme.setAttribute('name', 'color-scheme');
      document.head.appendChild(metaColorScheme);
    }
    metaColorScheme.setAttribute('content', colorScheme);
  }, [customColors]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const setCustomColors = (colors: CustomColors) => {
    setCustomColorsState(colors);
    if (typeof window !== 'undefined') {
      localStorage.setItem('customColors', JSON.stringify(colors));
      
      // カスタムテーマが選択されている場合、すぐに適用
      if (theme === 'custom' && isHydrated) {
        const root = document.documentElement;
        root.style.setProperty('--custom-primary', colors.primary);
        root.style.setProperty('--custom-secondary', colors.secondary);
        root.style.setProperty('--custom-accent', colors.accent);
      }
    }
  };

  // 後方互換性のためのヘルパー
  const isDarkMode = theme === 'dark';
  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const contextValue = React.useMemo(
    () => ({
      theme, customColors, isDarkMode, setTheme, setCustomColors, toggleDarkMode,
      backgroundImage, setBackgroundImage, backgroundOpacity, setBackgroundOpacity, backgroundBlur, setBackgroundBlur
    }),
    [theme, customColors, isDarkMode, backgroundImage, backgroundOpacity, backgroundBlur, setTheme, setCustomColors, toggleDarkMode, setBackgroundImage, setBackgroundOpacity, setBackgroundBlur]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
