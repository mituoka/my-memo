import React from 'react';

interface ShortcutsHelpProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'N'], mac: ['⌘', 'N'], description: '新規メモ作成' },
    { keys: ['Ctrl', 'S'], mac: ['⌘', 'S'], description: 'メモ保存' },
    { keys: ['Esc'], mac: ['Esc'], description: 'キャンセル/閉じる' },
    { keys: ['/'], mac: ['/'], description: '検索フォーカス' },
    { keys: ['Ctrl', '/'], mac: ['⌘', '/'], description: 'ショートカット一覧' }
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '1.5rem',
          maxWidth: '400px',
          width: '90%',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            キーボードショートカット
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {shortcuts.map((shortcut, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem',
              borderRadius: '4px',
              background: 'var(--background)'
            }}>
              <span style={{
                fontSize: '0.875rem',
                color: 'var(--text-primary)'
              }}>
                {shortcut.description}
              </span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(isMac ? shortcut.mac : shortcut.keys).map((key, keyIndex) => (
                  <kbd key={keyIndex} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '3px',
                    padding: '0.125rem 0.375rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-secondary)',
                    minWidth: '1.5rem',
                    textAlign: 'center'
                  }}>
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'var(--primary-light)',
          borderRadius: '4px',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)'
        }}>
          💡 入力中（テキストボックス内）では一部のショートカットは無効になります
        </div>
      </div>
    </div>
  );
};