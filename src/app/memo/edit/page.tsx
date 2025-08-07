'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemoStorage, Memo } from '@/hooks/useMemoStorage';

function EditMemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getMemo, updateMemo } = useMemoStorage();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    
    if (!id) {
      alert('メモIDが指定されていません');
      router.push('/');
      return;
    }

    const memoData = getMemo(id);
    if (memoData) {
      setMemo(memoData);
      setTitle(memoData.title);
      setContent(memoData.content);
      setTags(memoData.tags.join(', '));
    } else {
      alert('メモが見つかりませんでした');
      router.push('/');
      return;
    }
    setIsLoading(false);
  }, [searchParams, getMemo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    if (!memo) return;

    setIsSubmitting(true);

    try {
      const tagList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      updateMemo(memo.id, {
        title: title.trim(),
        content: content.trim(),
        tags: tagList
      });

      router.push('/');
    } catch (error) {
      console.error('メモの更新に失敗しました:', error);
      alert('メモの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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

  if (!memo) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="text-secondary">メモが見つかりませんでした</p>
      </div>
    );
  }

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
          メモを編集
        </h1>
        <p className="text-secondary" style={{ margin: 0 }}>
          メモの内容を変更して更新してください
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

          {/* Meta Info */}
          <div style={{ 
            marginBottom: '2rem',
            padding: '1rem',
            background: 'var(--background)',
            borderRadius: '4px',
            fontSize: '0.8125rem'
          }}>
            <p className="text-muted" style={{ margin: '0 0 0.25rem 0' }}>
              作成日時: {new Date(memo.createdAt).toLocaleString('ja-JP')}
            </p>
            {memo.updatedAt !== memo.createdAt && (
              <p className="text-muted" style={{ margin: 0 }}>
                最終更新: {new Date(memo.updatedAt).toLocaleString('ja-JP')}
              </p>
            )}
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
              {isSubmitting ? '更新中...' : 'メモを更新'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function EditMemo() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div className="spinner"></div>
      </div>
    }>
      <EditMemoContent />
    </Suspense>
  );
}