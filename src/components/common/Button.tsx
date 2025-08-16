import React, { useMemo } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

const baseStyles = {
  border: 'none',
  borderRadius: '4px',
  fontWeight: '500',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
} as const;

const variantStyles = {
  primary: {
    backgroundColor: 'var(--primary)',
    color: 'white',
  },
  secondary: {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
  danger: {
    backgroundColor: '#ef4444',
    color: 'white',
  }
} as const;

const sizeStyles = {
  sm: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
  },
  md: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
  },
  lg: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
  }
} as const;

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  title,
  style
}: ButtonProps) {
  const styles = useMemo(() => ({
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...style
  }), [variant, size, disabled, style]);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styles}
      className={className}
      title={title}
    >
      {children}
    </button>
  );
}