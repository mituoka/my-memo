'use client';

import MemoDetail from '@/components/MemoDetail';
import Link from 'next/link';

interface MemoPageClientProps {
  params: { id: string };
}

export default function MemoPageClient({ params }: MemoPageClientProps) {
  const memoId = parseInt(params.id, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-700 mr-3"
        >
          ← ホームに戻る
        </Link>
      </div>
      
      <div className="rounded-lg shadow p-6" style={{background: 'var(--background)'}}>
        <MemoDetail memoId={memoId} />
      </div>
    </div>
  );
}