'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMemoStorage } from '@/hooks/useMemoStorage';

export default function Home() {
  const { memos, isLoaded, deleteMemo } = useMemoStorage();
  const [searchTerm, setSearchTerm] = useState('');

  // フィルタリングされたメモ
  const filteredMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string, title: string) => {
    if (confirm(`「${title}」を削除しますか？`)) {
      deleteMemo(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString('ja-JP');
  };

  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              margin: '0 0 0.5rem 0',
              color: 'var(--text-primary)'
            }}>
              マイメモ
            </h1>
            <p className="text-secondary" style={{ margin: 0 }}>
              {memos.length > 0 ? `${memos.length}件のメモ` : 'まだメモがありません'}
            </p>
          </div>
          
          {memos.length === 0 && (
            <Link href="/memo/new" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
              <svg 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2"
                style={{ marginRight: '0.5rem' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              最初のメモを作成
            </Link>
          )}
        </div>
        
        {/* Search Bar */}
        {memos.length > 0 && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="メモを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingRight: '2.5rem' }}
            />
            <svg
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: 'var(--text-muted)'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      {memos.length === 0 ? (
        // Empty State
        <div className="card" style={{ 
          padding: '3rem 2rem', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            opacity: 0.8
          }}>
            <svg 
              width="28" 
              height="28" 
              fill="none" 
              stroke="white" 
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            margin: '0 0 0.5rem 0',
            color: 'var(--text-primary)'
          }}>
            メモを作成して始めましょう
          </h3>
          
          <p className="text-secondary" style={{ 
            margin: '0 0 1.5rem 0',
            fontSize: '0.9375rem'
          }}>
            思考、アイデア、タスクを整理して管理できます
          </p>
          
          <Link href="/memo/new" className="btn btn-primary">
            最初のメモを作成
          </Link>
        </div>
      ) : filteredMemos.length === 0 ? (
        // No Search Results
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p className="text-secondary">「{searchTerm}」に一致するメモが見つかりません</p>
        </div>
      ) : (
        // Memo Grid
        <div className="grid-responsive">
          {filteredMemos.map((memo) => (
            <div key={memo.id} className="card" style={{ padding: '1.5rem' }}>
              {/* Memo Header */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  margin: '0 0 0.5rem 0',
                  color: 'var(--text-primary)',
                  lineHeight: '1.5',
                  wordBreak: 'break-word'
                }}>
                  {memo.title}
                </h3>
                
                {memo.content && (
                  <p 
                    className="text-secondary truncate-2" 
                    style={{ 
                      margin: 0, 
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}
                  >
                    {memo.content}
                  </p>
                )}
              </div>
              
              {/* Tags */}
              {memo.tags.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {memo.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Footer */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                  {formatDate(memo.createdAt)}
                  {memo.updatedAt !== memo.createdAt && (
                    <span style={{ marginLeft: '0.5rem' }}>
                      (編集済み)
                    </span>
                  )}
                </span>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={`/memo/edit/${memo.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(memo.id, memo.title)}
                    className="btn btn-secondary btn-sm"
                    style={{ 
                      color: 'var(--error)',
                      borderColor: 'color-mix(in srgb, var(--error) 30%, transparent)'
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Stats */}
      {memos.length > 0 && (
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          padding: '1rem',
          background: 'var(--surface)',
          borderRadius: '6px',
          border: '1px solid var(--border)'
        }}>
          <span className="text-muted" style={{ fontSize: '0.875rem' }}>
            総メモ数: {memos.length}
            {searchTerm && filteredMemos.length !== memos.length && (
              <span style={{ marginLeft: '1rem' }}>
                表示中: {filteredMemos.length}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}