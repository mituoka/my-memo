import React from 'react';
import type { SortSettings, SortField } from '@/types';

interface SortControlsProps {
  readonly sortSettings: SortSettings;
  readonly onSort: (field: SortField) => void;
  readonly getSortLabel: (field: SortField) => string;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortSettings,
  onSort,
  getSortLabel
}) => {
  const sortFields: SortField[] = ['updatedAt', 'createdAt', 'title'];

  const getSortIcon = (field: SortField) => {
    if (sortSettings.field !== field) {
      return (
        <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortSettings.order === 'asc') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      marginBottom: '1rem'
    }}>
      <span style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        fontWeight: '500'
      }}>
        並び替え:
      </span>
      
      {sortFields.map(field => (
        <button
          key={field}
          onClick={() => onSort(field)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            background: sortSettings.field === field ? 'var(--primary)' : 'var(--surface)',
            color: sortSettings.field === field ? 'white' : 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (sortSettings.field !== field) {
              e.currentTarget.style.background = 'var(--surface-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (sortSettings.field !== field) {
              e.currentTarget.style.background = 'var(--surface)';
            }
          }}
        >
          {getSortLabel(field)}
          {getSortIcon(field)}
        </button>
      ))}
    </div>
  );
};