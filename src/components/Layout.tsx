import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          margin: 0,
          color: 'var(--text-primary)'
        }}>
          📝 マイメモ
        </h1>
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