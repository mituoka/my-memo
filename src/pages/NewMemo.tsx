import React from 'react';
import MemoEditor from '../components/MemoEditor';

function NewMemo() {
  return (
    <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          margin: '0 0 0.5rem 0',
          color: 'var(--text-primary)'
        }}>
          新規メモ作成
        </h1>
        <p className="text-secondary" style={{ margin: 0 }}>
          タイトルと内容を入力してメモを作成してください
        </p>
      </div>

      {/* Form */}
      <div className="slide-in-right" style={{ animationDelay: '0.2s' }}>
        <MemoEditor mode="create" />
      </div>
    </div>
  );
}

export default NewMemo;