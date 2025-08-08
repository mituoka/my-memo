import React, { useState } from 'react';
import { SettingsPanel } from './SettingsPanel';
import { useBackground } from '../contexts/BackgroundContext';

interface LayoutProps {
  children: React.ReactNode;
}

function Header() {
  const { hasBackground } = useBackground();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className={`header ${hasBackground ? 'header-enhanced' : ''}`}>
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
          
          {/* 設定ボタン */}
          <button
            onClick={() => setShowSettings(true)}
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
            title="設定"
          >
            ⚙️
          </button>
        </div>
      </header>
      
      {/* 設定パネル */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
}

function Footer() {
  const { hasBackground } = useBackground();
  
  return (
    <footer className={`footer ${hasBackground ? 'footer-enhanced' : ''}`}>
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