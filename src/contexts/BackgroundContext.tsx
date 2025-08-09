import React, { createContext, useContext, useState, useEffect } from 'react';

export type BackgroundType = 'none' | 'custom' | 'preset';

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'gradient' | 'pattern';
  css: string;
  thumbnail: string;
}

export interface BackgroundSettings {
  type: BackgroundType;
  customImage?: string; // base64 or URL
  presetId?: string;
  opacity: number; // 0-1
  blur: number; // 0-10px
}

interface BackgroundContextType {
  settings: BackgroundSettings;
  updateSettings: (newSettings: Partial<BackgroundSettings>) => void;
  uploadCustomImage: (file: File) => Promise<void>;
  resetBackground: () => void;
  getPresets: () => BackgroundPreset[];
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

const BACKGROUND_STORAGE_KEY = 'memo_app_background';

// プリセット背景画像
const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'gradient-blue',
    name: 'ブルーグラデーション',
    type: 'gradient',
    css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'gradient-sunset',
    name: 'サンセット',
    type: 'gradient', 
    css: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
  },
  {
    id: 'gradient-ocean',
    name: 'オーシャン',
    type: 'gradient',
    css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    thumbnail: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'gradient-forest',
    name: 'フォレスト',
    type: 'gradient',
    css: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    thumbnail: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
  },
  {
    id: 'pattern-dots',
    name: 'ドットパターン',
    type: 'pattern',
    css: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
    thumbnail: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)'
  },
  {
    id: 'pattern-grid',
    name: 'グリッドパターン',
    type: 'pattern',
    css: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
    thumbnail: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)'
  }
];

const DEFAULT_SETTINGS: BackgroundSettings = {
  type: 'none',
  opacity: 0.3,
  blur: 0
};

interface BackgroundProviderProps {
  children: React.ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<BackgroundSettings>(DEFAULT_SETTINGS);

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    const savedSettings = localStorage.getItem(BACKGROUND_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse background settings:', error);
      }
    }
  }, []);

  // 設定が変更されたときにCSSを適用
  useEffect(() => {
    const applyBackground = () => {
      const body = document.body;
      
      if (settings.type === 'none') {
        body.style.backgroundImage = '';
        body.style.backgroundSize = '';
        body.style.backgroundPosition = '';
        body.style.backgroundRepeat = '';
        return;
      }

      let backgroundCSS = '';
      
      if (settings.type === 'custom' && settings.customImage) {
        backgroundCSS = `url("${settings.customImage}")`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundRepeat = 'no-repeat';
      } else if (settings.type === 'preset' && settings.presetId) {
        const preset = BACKGROUND_PRESETS.find(p => p.id === settings.presetId);
        if (preset) {
          backgroundCSS = preset.css;
          if (preset.type === 'pattern') {
            body.style.backgroundSize = '20px 20px';
            body.style.backgroundPosition = '0 0';
            body.style.backgroundRepeat = 'repeat';
          } else {
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundRepeat = 'no-repeat';
          }
        }
      }

      if (backgroundCSS) {
        // 透明度とブラーを適用
        const overlay = settings.blur > 0 ? `blur(${settings.blur}px)` : '';
        body.style.backgroundImage = backgroundCSS;
        
        // 透明度とブラー用のオーバーレイを作成
        let existingOverlay = document.getElementById('background-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }
        
        if (settings.opacity < 1 || settings.blur > 0) {
          const overlayDiv = document.createElement('div');
          overlayDiv.id = 'background-overlay';
          overlayDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, ${1 - settings.opacity});
            backdrop-filter: ${overlay};
            pointer-events: none;
            z-index: -1;
          `;
          document.body.appendChild(overlayDiv);
        }
      }
    };

    applyBackground();
    
    // 設定をローカルストレージに保存
    localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<BackgroundSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const uploadCustomImage = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('画像ファイルを選択してください'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB制限
        reject(new Error('ファイルサイズは5MB以下にしてください'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        updateSettings({
          type: 'custom',
          customImage: base64
        });
        resolve();
      };
      reader.onerror = () => {
        reject(new Error('ファイルの読み込みに失敗しました'));
      };
      reader.readAsDataURL(file);
    });
  };

  const resetBackground = () => {
    setSettings(DEFAULT_SETTINGS);
    // オーバーレイも削除
    const existingOverlay = document.getElementById('background-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
  };

  const getPresets = () => BACKGROUND_PRESETS;

  const value: BackgroundContextType = {
    settings,
    updateSettings,
    uploadCustomImage,
    resetBackground,
    getPresets
  };

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
};