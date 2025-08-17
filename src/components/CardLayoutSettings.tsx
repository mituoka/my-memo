import React, { useState } from 'react';
import type { CardLayout, CardLayoutSettings } from '@/types';

interface CardLayoutSelectorProps {
  readonly cardLayoutSettings: CardLayoutSettings;
  readonly onCardLayoutChange: (layout: CardLayout) => void;
  readonly getCardLayoutLabel: (layout: CardLayout) => string;
  readonly getCardLayoutDescription: (layout: CardLayout) => string;
}

export const CardLayoutSettings: React.FC<CardLayoutSelectorProps> = ({
  cardLayoutSettings,
  onCardLayoutChange,
  getCardLayoutLabel,
  getCardLayoutDescription
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const layouts: CardLayout[] = ['default', 'compact', 'detailed', 'minimal'];

  const getLayoutIcon = (layout: CardLayout) => {
    switch (layout) {
      case 'default':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <rect x="3" y="3" width="18" height="6" rx="2"></rect>
            <rect x="3" y="11" width="18" height="6" rx="2"></rect>
          </svg>
        );
      case 'compact':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <rect x="3" y="3" width="18" height="4" rx="1"></rect>
            <rect x="3" y="9" width="18" height="4" rx="1"></rect>
            <rect x="3" y="15" width="18" height="4" rx="1"></rect>
          </svg>
        );
      case 'detailed':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <rect x="3" y="3" width="18" height="8" rx="2"></rect>
            <rect x="3" y="13" width="18" height="8" rx="2"></rect>
          </svg>
        );
      case 'minimal':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* トリガーボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          background: 'var(--background)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--surface-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--background)';
        }}
      >
        {getLayoutIcon(cardLayoutSettings.layout)}
        <span>レイアウト</span>
        <svg 
          width="16" 
          height="16" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          strokeWidth="2"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          {layouts.map((layout, index) => (
            <button
              key={layout}
              onClick={() => {
                onCardLayoutChange(layout);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '1rem',
                border: 'none',
                background: cardLayoutSettings.layout === layout ? 'var(--primary-light)' : 'transparent',
                color: cardLayoutSettings.layout === layout ? 'var(--primary)' : 'var(--text-primary)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: index < layouts.length - 1 ? '1px solid var(--border)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (cardLayoutSettings.layout !== layout) {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (cardLayoutSettings.layout !== layout) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem'
              }}>
                {getLayoutIcon(layout)}
                <span style={{ 
                  fontWeight: '600',
                  fontSize: '0.9375rem'
                }}>
                  {getCardLayoutLabel(layout)}
                </span>
                {cardLayoutSettings.layout === layout && (
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: 'auto' }}>
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                {getCardLayoutDescription(layout)}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* オーバーレイ（クリック時に閉じる） */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          role="button"
          tabIndex={-1}
          aria-label="カードレイアウト設定を閉じる"
        />
      )}
    </div>
  );
};