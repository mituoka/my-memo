import React from 'react';

interface ErrorAlertProps {
  message: string | null | undefined;
  onClose?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export default function ErrorAlert({ message, onClose, variant = 'error' }: ErrorAlertProps) {
  if (!message) return null;

  const variants = {
    error: {
      backgroundColor: '#fef2f2',
      borderColor: '#ef4444',
      textColor: '#dc2626',
      icon: '❌'
    },
    warning: {
      backgroundColor: '#fffbeb',
      borderColor: '#f59e0b',
      textColor: '#d97706',
      icon: '⚠️'
    },
    info: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6',
      textColor: '#2563eb',
      icon: 'ℹ️'
    }
  };

  const variantStyle = variants[variant];

  const alertStyles: React.CSSProperties = {
    backgroundColor: variantStyle.backgroundColor,
    borderLeft: `4px solid ${variantStyle.borderColor}`,
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  };

  const messageStyles: React.CSSProperties = {
    color: variantStyle.textColor,
    flex: 1,
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: '1.5'
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: variantStyle.textColor,
    cursor: 'pointer',
    fontSize: '1.125rem',
    padding: 0,
    opacity: 0.7,
    transition: 'opacity 0.2s ease'
  };

  return (
    <div style={alertStyles}>
      <span style={{ fontSize: '1rem' }}>{variantStyle.icon}</span>
      <p style={messageStyles}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          style={closeButtonStyles}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          ×
        </button>
      )}
    </div>
  );
}