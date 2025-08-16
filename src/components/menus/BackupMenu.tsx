import React from 'react';

interface BackupMenuProps {
  isOpen: boolean;
  onClose: () => void;
  memosCount: number;
  onExport: () => void;
  onImport: () => void;
}

function BackupMenu({ isOpen, onClose, memosCount, onExport, onImport }: BackupMenuProps) {
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
          onClick={onExport}
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem'}}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          エクスポート ({memosCount}件)
        </button>
        
        <button
          onClick={onImport}
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem'}}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          インポート
        </button>
      </div>
    </>
  );
}

export default BackupMenu;