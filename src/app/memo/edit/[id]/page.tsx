'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMemoStorage, Memo } from '@/hooks/useMemoStorage';

export default function EditMemo({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getMemo, updateMemo } = useMemoStorage();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchMemo = () => {
      const memoData = getMemo(params.id);
      if (memoData) {
        setMemo(memoData);
        setTitle(memoData.title);
        setContent(memoData.content);
        setTags(memoData.tags.join(', '));
      } else {
        alert('メモが見つかりませんでした');
        router.push('/');
      }
      setIsLoading(false);
    };

    fetchMemo();
  }, [params.id, getMemo, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('タイトルを入力してください');
      return;
    }

    if (!memo) return;

    const tagList = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    updateMemo(memo.id, {
      title,
      content,
      tags: tagList
    });
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">メモを編集</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg h-64 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="メモの内容を入力してください..."
          />
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            タグ (カンマ区切り)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="仕事, アイデア, タスク"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
