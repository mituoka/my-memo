import React from 'react';

interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
}

interface FontMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentFont: FontOption;
  fontOptions: FontOption[];
  onFontChange: (fontId: string) => void;
}

function FontMenu({ isOpen, onClose, currentFont, fontOptions, onFontChange }: FontMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'default'
        }}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: '9rem',
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
        <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          フォント: {currentFont.name}
        </div>

        {fontOptions.map(font => (
          <button
            key={font.id}
            onClick={() => onFontChange(font.id)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              background: currentFont.id === font.id ? 'var(--background)' : 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border)',
              fontFamily: font.fontFamily,
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              if (currentFont.id !== font.id) {
                e.currentTarget.style.background = 'var(--background)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentFont.id !== font.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span>{font.name}</span>
            {currentFont.id === font.id && (
              <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>✓</span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

export default FontMenu;