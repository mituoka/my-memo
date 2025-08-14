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
                {memo.images && memo.images.length > 0 ? (
                  <div className="mb-3">
                    <img
                      src={memo.images[0]}
                      alt={memo.title}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                ) : (
                  <div style={{ 
                    marginBottom: '0.75rem',
                    height: '80px',
                    borderRadius: '6px',
                    border: '1px solid var(--custom-secondary)',
                    background: `linear-gradient(135deg, ${
                      memo.type === 'note' ? 'rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%' :
                      memo.type === 'wiki' ? 'rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%' :
                      'rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%'
                    })`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: `${
                        memo.type === 'note' ? '#10B981' :
                        memo.type === 'wiki' ? '#F59E0B' :
                        '#3B82F6'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        {memo.type === 'note' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .708A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        ) : memo.type === 'wiki' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-16.5H6a2.25 2.25 0 00-2.25 2.25v16.5A2.25 2.25 0 006 22.5h12a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        )}
                      </svg>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--foreground)',
                      opacity: 0.7
                    }}>
                      画像なし
                    </div>
                  </div>
                )}
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
