'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoStorage } from '@/hooks/useMemoStorage';

export default function NewMemo() {
  const router = useRouter();
  const { addMemo } = useMemoStorage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const tagList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      addMemo({
        title: title.trim(),
        content: content.trim(),
        tags: tagList
      });

      router.push('/');
    } catch (error) {
      console.error('メモの作成に失敗しました:', error);
      alert('メモの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '2rem' }}>
          {/* Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="title" 
              style={{ 
                display: 'block',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}
            >
              タイトル <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="メモのタイトルを入力してください"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="content" 
              style={{ 
                display: 'block',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}
            >
              内容
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input textarea"
              placeholder="メモの内容を入力してください..."
              disabled={isSubmitting}
              style={{ minHeight: '200px' }}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '2rem' }}>
            <label 
              htmlFor="tags" 
              style={{ 
                display: 'block',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}
            >
              タグ
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input"
              placeholder="タグをカンマ区切りで入力 (例: 仕事, アイデア, タスク)"
              disabled={isSubmitting}
            />
            <p className="text-muted" style={{ 
              fontSize: '0.8125rem', 
              marginTop: '0.5rem',
              margin: '0.5rem 0 0 0'
            }}>
              複数のタグはカンマで区切って入力してください
            </p>
          </div>

          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting && <div className="spinner" style={{ width: '16px', height: '16px' }}></div>}
              {isSubmitting ? '作成中...' : 'メモを作成'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}