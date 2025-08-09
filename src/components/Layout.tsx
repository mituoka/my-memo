import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
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
    </div>
  );
}

export default Layout;