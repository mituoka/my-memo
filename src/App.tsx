import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { FontProvider } from './contexts/FontContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewMemo from './pages/NewMemo';
import EditMemo from './pages/EditMemo';

function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <BackgroundProvider>
          <Router basename="/my-memo">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/memo/new" element={<NewMemo />} />
                <Route path="/memo/edit/:id" element={<EditMemo />} />
              </Routes>
            </Layout>
          </Router>
        </BackgroundProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

export default App;