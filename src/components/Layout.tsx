import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useBackup } from '../hooks/useBackup';
import { useBackground } from '../contexts/BackgroundContext';

interface LayoutProps {
  children: React.ReactNode;
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { memos, importMemos } = useMemoStorage();
  const { exportToJSON, triggerImport } = useBackup();
  const { settings, updateSettings, uploadCustomImage, resetBackground, getPresets } = useBackground();
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);

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
          📝 マイメモ
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative' }}>
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
            🖼️
          </button>

          {showBackgroundMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: '6rem',
                marginTop: '0.5rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                minWidth: '280px',
                maxHeight: '400px',
                overflow: 'auto'
              }}
            >
              {/* カスタム画像アップロード */}
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  🖼️ カスタム背景画像
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  JPG, PNG, GIF (最大5MB)
                </p>
              </div>

              {/* プリセット背景 */}
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  🎨 プリセット背景
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {getPresets().map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.id)}
                      style={{
                        padding: '0.5rem',
                        border: settings.presetId === preset.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '4px',
                        background: preset.thumbnail,
                        height: '40px',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      title={preset.name}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          fontSize: '0.625rem',
                          padding: '0.125rem 0.25rem',
                          textAlign: 'center'
                        }}
                      >
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 透明度・ブラー設定 */}
              {settings.type !== 'none' && (
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      透明度: {Math.round(settings.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={settings.opacity}
                      onChange={(e) => updateSettings({ opacity: parseFloat(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      ブラー: {settings.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={settings.blur}
                      onChange={(e) => updateSettings({ blur: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}

              {/* リセットボタン */}
              <div style={{ padding: '1rem' }}>
                <button
                  onClick={handleBackgroundReset}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  🗑️ 背景をリセット
                </button>
              </div>
            </div>
          )}

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
            💾
          </button>

          {showBackupMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: '3rem',
                marginTop: '0.5rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                minWidth: '200px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={handleExport}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--border)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                📤 エクスポート ({memos.length}件)
              </button>
              
              <button
                onClick={handleImport}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                📥 インポート
              </button>
            </div>
          )}

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
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
      
      {/* メニュー外クリックでメニューを閉じる */}
      {(showBackupMenu || showBackgroundMenu) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => {
            setShowBackupMenu(false);
            setShowBackgroundMenu(false);
          }}
        />
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p style={{ margin: 0 }}>
          Built with React • ローカルストレージで動作
        </p>
      </div>
    </footer>
  );
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;