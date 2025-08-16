import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useBackup } from '../hooks/useBackup';
import { useBackground } from '../contexts/BackgroundContext';
import { useFont } from '../contexts/FontContext';
import BackupMenu from './menus/BackupMenu';
import BackgroundMenu from './menus/BackgroundMenu';
import FontMenu from './menus/FontMenu';

function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { memos, importMemos } = useMemoStorage();
  const { exportToJSON, triggerImport } = useBackup();
  const { settings, updateSettings, uploadCustomImage, resetBackground, getPresets } = useBackground();
  const { currentFont, setFont, fontOptions } = useFont();
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  const handleExport = () => {
    exportToJSON(memos);
    setShowBackupMenu(false);
  };

  const handleImport = async () => {
    const backupData = await triggerImport();
    if (backupData) {
      const shouldReplace = window.confirm(
        `${backupData.totalCount}件のメモをインポートします。\n\n` +
        `「OK」: 既存データに追加\n` +
        `「キャンセル」: 全て置き換える場合は、再度お試しください`
      );
      
      if (shouldReplace) {
        const addedCount = importMemos(backupData.memos, false);
        alert(`${addedCount}件の新しいメモを追加しました`);
      } else {
        const confirmReplace = window.confirm(
          '本当に全てのメモを置き換えますか？\n既存のメモは全て削除されます。'
        );
        if (confirmReplace) {
          importMemos(backupData.memos, true);
          alert(`${backupData.totalCount}件のメモで置き換えました`);
        }
      }
    }
    setShowBackupMenu(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadCustomImage(file);
        setShowBackgroundMenu(false);
      } catch (error) {
        alert(error instanceof Error ? error.message : '画像のアップロードに失敗しました');
      }
    }
  };

  const handlePresetSelect = (presetId: string) => {
    updateSettings({ type: 'preset', presetId });
    setShowBackgroundMenu(false);
  };

  const handleBackgroundReset = () => {
    resetBackground();
    setShowBackgroundMenu(false);
  };

  const handleFontChange = (fontId: string) => {
    setFont(fontId);
    setShowFontMenu(false);
  };


  return (
    <header className="header">
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          margin: 0,
          color: 'var(--text-primary)'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              font: 'inherit',
              cursor: 'pointer',
              padding: '0.5rem',
              margin: '-0.5rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="ホームに戻る"
          >
            My Memo
          </button>
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative' }}>
          {/* フォント設定メニュー */}
          <button
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
            title="フォント設定"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
            </svg>
          </button>

          <FontMenu
            isOpen={showFontMenu}
            onClose={() => setShowFontMenu(false)}
            currentFont={currentFont}
            fontOptions={fontOptions}
            onFontChange={handleFontChange}
          />

          {/* 背景設定メニュー */}
          <button
            onClick={() => setShowBackgroundMenu(!showBackgroundMenu)}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
            title="背景設定"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </button>

          <BackgroundMenu
            isOpen={showBackgroundMenu}
            onClose={() => setShowBackgroundMenu(false)}
            settings={settings}
            onSettingsUpdate={updateSettings}
            onImageUpload={handleImageUpload}
            onPresetSelect={handlePresetSelect}
            onReset={handleBackgroundReset}
            presets={getPresets()}
          />

          {/* バックアップメニュー */}
          <button
            onClick={() => setShowBackupMenu(!showBackupMenu)}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
            title="バックアップ・復元"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </button>

          <BackupMenu
            isOpen={showBackupMenu}
            onClose={() => setShowBackupMenu(false)}
            memosCount={memos.length}
            onExport={handleExport}
            onImport={handleImport}
          />

          {/* テーマ切り替え */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem'
            }}
            title={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
    </header>
  );
}

export default Header;