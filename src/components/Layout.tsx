import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

function Header() {
  const { theme, toggleTheme } = useTheme();

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