'use client';

import { useMemo, useDeleteMemo } from '@/hooks/useMemoApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useCallback } from 'react';

interface MemoDetailProps {
  readonly memoId: number;
}

export default function MemoDetail({ memoId }: Readonly<MemoDetailProps>) {
  const { memo, loading, error } = useMemo(memoId);
  const { deleteMemo, loading: deleteLoading } = useDeleteMemo();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  // メモの削除処理
  const handleDelete = useCallback(async () => {
    if (await deleteMemo(memoId)) {
      router.push('/');
    }
  }, [deleteMemo, memoId, router]);

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  // ローディング中
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // エラー表示
  if (error || !memo) {
    return (
      <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg shadow-sm border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        エラー: {error?.message || 'メモが見つかりません'}
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      {/* メモのメタデータ */}
      <div className="flex justify-between items-center">
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            作成: {new Date(memo.created_at).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            更新: {new Date(memo.updated_at).toLocaleString()}
          </p>
        </div>
        
        {/* 操作ボタン */}
        <div className="flex space-x-3">
          <Link
            href={`/memo/edit/${memo.id}`}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 shadow-sm flex items-center gap-2 transition-all font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            編集
          </Link>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg flex items-center gap-2 transition-all font-medium"
            aria-label="メモを削除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            削除
          </button>
        </div>
      </div>

      {/* メモのタイトルと内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-teal-100 dark:border-teal-700">
        <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-300">{memo.title}</h1>
        <div className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {memo.content}
        </div>
      </div>

      {/* タグ表示 */}
      {memo.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 mt-3">
          {memo.tags.map(tag => (
            <Link
              key={tag.id}
              href={`/?tag=${encodeURIComponent(tag.name)}`}
              className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-700 text-sm hover:bg-teal-100 dark:hover:bg-teal-800 transition-colors duration-200"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 dark:text-white">メモを削除しますか？</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">この操作は元に戻せません。</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                disabled={deleteLoading}
              >
                {deleteLoading ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
