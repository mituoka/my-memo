'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ErrorBoundary>
      <div className="layout">
        <Header />
        <main className="main">
          <div className="container">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--primary)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg 
                width="18" 
                height="18" 
                fill="none" 
                stroke="white" 
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              FlexNote
            </span>
          </Link>

          {/* Navigation */}
          <Link href="/memo/new" className="btn btn-primary">
            <svg 
              width="16" 
              height="16" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth="2"
              style={{ marginRight: '0.5rem' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            新規メモ
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} FlexNote - シンプルメモアプリ</p>
      </div>
    </footer>
  );
}

export default ClientLayout;