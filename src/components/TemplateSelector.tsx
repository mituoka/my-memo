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
        className="btn btn-secondary template-selector-toggle"
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
          className={`template-selector-arrow ${showTemplates ? 'expanded' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* テンプレートリスト（展開式） */}
      <div
        className={`template-selector-dropdown ${showTemplates ? 'expanded' : ''}`}
      >
        <div className="template-selector-content">
          {templates.map((template, index) => (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onApplyTemplate(template);
                setShowTemplates(false);
              }}
              className={`template-item ${index === 0 ? 'first' : ''} ${index === templates.length - 1 ? 'last' : ''}`}
            >
              <div className="template-header">
                <div className={`template-indicator ${type}`}></div>
                {template.name}
              </div>
              <div className="template-description">
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