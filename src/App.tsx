import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { FontProvider } from './contexts/FontContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewMemo from './pages/NewMemo';
import EditMemo from './pages/EditMemo';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ShortcutsHelp } from './components/ShortcutsHelp';
import { PWABanner } from './components/PWABanner';

function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <BackgroundProvider>
          <Router basename="/my-memo">
            <AppWithKeyboardShortcuts />
          </Router>
        </BackgroundProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

function AppWithKeyboardShortcuts() {
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);

  useKeyboardShortcuts({
    onCancel: () => {
      if (isShortcutsHelpOpen) {
        setIsShortcutsHelpOpen(false);
      }
    }
  });

  // Override the global shortcut to show help
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        setIsShortcutsHelpOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memo/new" element={<NewMemo />} />
          <Route path="/memo/edit/:id" element={<EditMemo />} />
        </Routes>
      </Layout>
      
      <ShortcutsHelp 
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
      
      <PWABanner />
    </>
  );
}

export default App;