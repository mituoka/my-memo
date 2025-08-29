import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyState: React.FC = () => {
  return (
    <div className="card" style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '12px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem',
        backgroundColor: 'var(--primary-light)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg 
          width="40" 
          height="40" 
          fill="var(--primary)" 
          viewBox="0 0 24 24"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>

      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0'
      }}>
        まだメモがありません
      </h2>
      
      <p style={{
        color: 'var(--text-secondary)',
        margin: '0 0 2rem 0',
        fontSize: '1rem',
        lineHeight: 1.6
      }}>
        最初のメモを作成して、アイデアや重要な情報を記録しましょう
      </p>
      
      <Link 
        to="/memo/new" 
        className="btn btn-primary btn-lg"
        style={{ 
          fontSize: '1rem', 
          padding: '0.875rem 2rem',
          borderRadius: '8px',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600'
        }}
      >
        <svg 
          width="18" 
          height="18" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        メモを作成する
      </Link>

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--background)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <p style={{ margin: 0, fontWeight: '500', marginBottom: '0.5rem' }}>
          💡 ヒント
        </p>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1rem',
          textAlign: 'left',
          maxWidth: '300px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <li>画像を添付してビジュアルなメモに</li>
          <li>タグを使って整理</li>
          <li>検索で素早くメモを見つける</li>
        </ul>
      </div>
    </div>
  );
};