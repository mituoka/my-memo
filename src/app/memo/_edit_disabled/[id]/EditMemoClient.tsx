'use client';

import { useMemo } from '@/hooks/useMemoApi';
import MemoEditor from '@/components/MemoEditor';
import Link from 'next/link';

interface EditMemoClientProps {
  params: { id: string };
}

export default function EditMemoClient({ params }: EditMemoClientProps) {
  const memoId = parseInt(params.id, 10);
  const { memo, loading, error } = useMemo(memoId);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !memo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded text-red-700 dark:text-red-300">
          エラー: {error?.message || 'メモが見つかりません'}
        </div>
        <div className="mt-4">
          <Link href="/" className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href={`/memo/${memoId}`} 
          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-3"
        >
          ← 戻る
        </Link>
        <h1 className="text-2xl font-bold" style={{color: 'var(--foreground)'}}>メモを編集: {memo.title}</h1>
      </div>
      
      <div className="rounded-lg shadow p-6" style={{background: 'var(--background)'}}>
        <MemoEditor memo={memo} mode="edit" />
      </div>
    </div>
  );
}