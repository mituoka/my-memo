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
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          テンプレートを選択
        </button>

        {showTemplates && (
          <>
            {/* オーバーレイ */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={() => setShowTemplates(false)}
            />
            
            {/* テンプレートリスト */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                background: 'var(--background-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow)',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    onApplyTemplate(template);
                    setShowTemplates(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem'
                  }}>
                    {template.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4
                  }}>
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TemplateSelector;