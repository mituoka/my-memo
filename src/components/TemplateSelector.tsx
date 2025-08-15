import React, { useState } from 'react';
import { MemoType } from '../types';
import { Template, getTemplatesByType } from '../utils/templates';

interface TemplateSelectorProps {
  type: MemoType;
  onApplyTemplate: (template: Template) => void;
  className?: string;
}

function TemplateSelector({ type, onApplyTemplate, className = '' }: TemplateSelectorProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const templates = getTemplatesByType(type);

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setShowTemplates(!showTemplates)}
        className="btn btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        テンプレートを選択
        <svg 
          width="16" 
          height="16" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{
            transform: showTemplates ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* テンプレートリスト（展開式） */}
      <div
        style={{
          maxHeight: showTemplates ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          marginTop: showTemplates ? '1rem' : '0'
        }}
      >
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow)',
            opacity: showTemplates ? 1 : 0,
            transform: showTemplates ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease'
          }}
        >
          {templates.map((template, index) => (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onApplyTemplate(template);
                setShowTemplates(false);
              }}
              style={{
                width: '100%',
                padding: '1rem',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                borderBottom: index < templates.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background-color 0.2s ease',
                borderRadius: index === 0 ? '8px 8px 0 0' : 
                           index === templates.length - 1 ? '0 0 8px 8px' : '0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                fontSize: '0.9375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: type === 'note' ? '#10B981' : '#F59E0B'
                }}></div>
                {template.name}
              </div>
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}>
                {template.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;