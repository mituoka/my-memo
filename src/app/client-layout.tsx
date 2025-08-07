'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import SettingsSidebar from "../components/SettingsSidebar";
import ErrorBoundary from "../components/ErrorBoundary";
import ThemeScript from "../components/ThemeScript";

function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <SimpleHeader />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <SimpleFooter />
      </div>
    </ErrorBoundary>
  );
}

function SimpleHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">FlexNote</span>
          </Link>
          <Link 
            href="/memo/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            新規メモ
          </Link>
        </div>
      </div>
    </header>
  );
}

function SimpleFooter() {
  const [todayString, setTodayString] = useState('');
  
  useEffect(() => {
    const today = new Date();
    setTodayString(`${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`);
  }, []);

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
        &copy; {todayString} FlexNote - フレックスノート
      </div>
    </footer>
  );
}

export default ClientLayout;