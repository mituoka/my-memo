import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'md'
}: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' }
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: 'var(--surface)',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    ...sizeStyles[size]
  };

  const headerStyles: React.CSSProperties = {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const contentStyles: React.CSSProperties = {
    padding: '1.5rem'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={overlayStyles} onClick={handleOverlayClick}>
      <div style={modalStyles}>
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && (
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.25rem', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                onClick={onClose}
                variant="secondary"
                size="sm"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  padding: 0,
                  fontSize: '1.125rem'
                }}
              >
                ×
              </Button>
            )}
          </div>
        )}
        <div style={contentStyles}>
          {children}
        </div>
      </div>
    </div>
  );
}