import { useTags } from '@/hooks/useMemoApi';
import { Link } from 'react-router-dom';
import { memo } from 'react';
import type { TagCloudProps } from '@/types';

function TagCloud({ selectedTag, onClearTag }: Readonly<TagCloudProps>) {
  const { tags, loading, error } = useTags();
  
  if (loading) {
    return <div className="h-10 bg-teal-100/40 dark:bg-teal-900/40 animate-pulse rounded-xl"></div>;
  }
  
  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-sm py-2">
        タグの読み込み中にエラーが発生しました: {error.message}
      </div>
    );
  }
  
  if (tags.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-teal-100 dark:border-teal-800 rounded-xl p-5 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 dark:text-teal-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          タグ一覧
        </h3>
        {selectedTag && onClearTag && (
          <button 
            onClick={onClearTag}
            className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 flex items-center gap-1 font-medium transition-colors"
            aria-label="タグフィルターを解除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            フィルター解除
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link
            key={tag.id}
            to={`/?tag=${encodeURIComponent(tag.name)}`}
            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
              selectedTag === tag.name 
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm' 
                : 'bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-800 border border-teal-100 dark:border-teal-700'
            }`}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// React.memo() で最適化 - selectedTagとonClearTagが変わった時のみ再レンダリング
export default memo(TagCloud, (prevProps, nextProps) => {
  return prevProps.selectedTag === nextProps.selectedTag && 
         prevProps.onClearTag === nextProps.onClearTag;
});
