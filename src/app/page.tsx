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

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">ロード中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">マイメモ</h1>
        </div>
        
        {/* 検索バー */}
        <div className="relative">
          <input
            type="text"
            placeholder="メモを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* メモ一覧 */}
      {filteredMemos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {memos.length === 0 ? 'メモがありません' : '検索結果が見つかりません'}
          </div>
          {memos.length === 0 && (
            <Link 
              href="/memo/new"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              最初のメモを作成しませんか？
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMemos.map((memo) => (
            <div key={memo.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3">
                <h3 className="text-lg font-semibold mb-1 truncate">
                  {memo.title}
                </h3>
                <p className="text-gray-600 text-sm overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {memo.content || 'メモの内容がありません'}
                </p>
              </div>
              
              {/* タグ */}
              {memo.tags.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {memo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 日付 */}
              <div className="text-xs text-gray-500 mb-3">
                作成: {new Date(memo.createdAt).toLocaleDateString('ja-JP')}
                {memo.updatedAt !== memo.createdAt && (
                  <span className="ml-2">
                    更新: {new Date(memo.updatedAt).toLocaleDateString('ja-JP')}
                  </span>
                )}
              </div>
              
              {/* アクション */}
              <div className="flex justify-end gap-2">
                <Link
                  href={`/memo/edit/${memo.id}`}
                  className="px-3 py-1 text-blue-600 hover:bg-blue-50 text-sm rounded transition-colors"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(memo.id, memo.title)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 text-sm rounded transition-colors"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 統計情報 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        総メモ数: {memos.length}
        {searchTerm && filteredMemos.length !== memos.length && (
          <span className="ml-4">
            表示中: {filteredMemos.length}
          </span>
        )}
      </div>
    </div>
  );
}
