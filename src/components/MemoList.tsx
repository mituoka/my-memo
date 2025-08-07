'use client';

import { useMemos } from '@/hooks/useMemoApi';
import { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import type { MemoListProps } from '@/types';

function MemoList({ selectedTag }: Readonly<MemoListProps>) {
  const { memos, loading, error } = useMemos(selectedTag);
  const [searchTerm, setSearchTerm] = useState('');

  // 検索フィルタリング（メモ化して最適化）
  const filteredMemos = useMemo(() => {
    if (!searchTerm) return memos;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return memos.filter(memo => 
      memo.title.toLowerCase().includes(lowerSearchTerm) || 
      memo.content.toLowerCase().includes(lowerSearchTerm)
    );
  }, [memos, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 p-4 rounded text-red-700 dark:text-red-300">
        エラー: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="メモを検索..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            borderColor: 'var(--custom-secondary)'
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-2 top-2 hover:opacity-70"
            style={{color: 'var(--custom-primary)'}}
            onClick={() => setSearchTerm('')}
            aria-label="検索をクリア"
          >
            ✕
          </button>
        )}
      </div>

      {filteredMemos.length === 0 ? (
        <div className="text-center py-8" style={{color: 'var(--foreground)', opacity: 0.7}}>
          {searchTerm ? 'メモが見つかりませんでした' : 'メモがありません。新しいメモを作成しましょう！'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemos.map((memo) => (
            <Link 
              key={memo.id} 
              href={`/memo/${memo.id}`}
            className="block rounded-lg hover:shadow-md transition-shadow duration-200"
            style={{background: 'var(--background)', borderColor: 'var(--custom-secondary)', borderWidth: 1, borderStyle: 'solid'}} 
            >
              <div className="p-4">
                <h3 className="font-medium text-lg truncate" style={{color: 'var(--foreground)'}}>{memo.title}</h3>
                <p className="text-sm line-clamp-3 mt-1" style={{color: 'var(--foreground)', opacity: 0.8}}>{memo.content}</p>
                
                {memo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {memo.tags.map(tag => (
                      <span 
                        key={tag.id} 
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-xs mt-3" style={{color: 'var(--foreground)', opacity: 0.6}}>
                  更新: {new Date(memo.updated_at).toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// React.memo() で最適化 - selectedTagが変わった時のみ再レンダリング
export default memo(MemoList, (prevProps, nextProps) => {
  return prevProps.selectedTag === nextProps.selectedTag;
});
