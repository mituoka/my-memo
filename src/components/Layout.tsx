import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useBackup } from '../hooks/useBackup';

interface LayoutProps {
  children: React.ReactNode;
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { memos, importMemos } = useMemoStorage();
  const { exportToJSON, triggerImport } = useBackup();
  const [showBackupMenu, setShowBackupMenu] = useState(false);

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
      {showBackupMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowBackupMenu(false)}
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