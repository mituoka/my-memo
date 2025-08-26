import React, { memo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFont } from '../contexts/FontContext';
import { useCacheManager } from '../hooks/useCacheManager';

interface SettingsSidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const [dateString, setDateString] = React.useState('--');
  React.useEffect(() => {
    setDateString(new Date().toLocaleDateString('ja-JP'));
  }, []);
  const {
    theme, setTheme,
    // 背景画像関連のstate削除
  } = useTheme();
  
  const { currentFont, setFont, fontOptions } = useFont();
  const { cacheInfo, isRefreshing, forceRefresh, checkForUpdates } = useCacheManager();

  const getThemeName = (currentTheme: string) => {
    switch (currentTheme) {
      case 'light': return 'ライト';
      case 'dark': return 'ダーク';
      case 'custom': return 'カスタム（パープル）';
      default: return 'ライト';
    }
  };

  return (
    <>
      {/* オーバーレイ（サイドバーが開いている時のみ表示） */}
      {isOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          aria-label="設定サイドバーを閉じる"
          type="button"
        />
      )}
      
      {/* サイドバー（右側固定） */}
      <div className={`
        fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 shadow-xl border-l z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        overflow-hidden
      `}
        style={{background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--custom-secondary)'}}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b" style={{borderColor: 'var(--custom-secondary)'}}>
          <h2 className="text-lg font-semibold">設定</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md transition-colors hover:opacity-80"
            aria-label="設定を閉じる"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 設定内容 */}
        <div className="p-4 space-y-6 overflow-y-auto h-full">
          {/* 表示設定セクション */}
          <div>
            <h3 className="text-sm font-medium mb-4">表示設定</h3>
            
            {/* テーマ選択 */}
            <div className="space-y-3">
              <span className="text-sm font-medium">テーマ</span>
              
              {/* カラーサークル選択 */}
              <div className="grid grid-cols-3 gap-3">
                {/* ライトテーマ */}
                <button
                  onClick={() => setTheme('light')}
                  className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 custom:bg-purple-900/20 custom:border-purple-500'
                      : 'border-gray-200 dark:border-gray-700 custom:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 custom:hover:border-gray-600'
                  }`}
                >
                  {/* カラーサークル */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-white border-2 border-gray-300 shadow-sm mb-2"></div>
                  <span className="text-xs text-gray-900 dark:text-white custom:text-white">ライト</span>
                  {theme === 'light' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 custom:bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* ダークテーマ */}
                <button
                  onClick={() => setTheme('dark')}
                  className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 custom:bg-purple-900/20 custom:border-purple-500'
                      : 'border-gray-200 dark:border-gray-700 custom:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 custom:hover:border-gray-600'
                  }`}
                >
                  {/* カラーサークル */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 shadow-sm mb-2"></div>
                  <span className="text-xs text-gray-900 dark:text-white custom:text-white">ダーク</span>
                  {theme === 'dark' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 custom:bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

              </div>
              
            <p className="text-xs text-gray-500 dark:text-gray-400 custom:text-gray-400">
              現在のテーマ: {getThemeName(theme)}
            </p>

            </div>

            
            {/* フォント設定 */}
            <div className="mt-6 space-y-3">
              <span className="text-sm font-medium">フォント</span>
              
              <div className="space-y-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setFont(font.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all hover:bg-gray-50 dark:hover:bg-gray-800 custom:hover:bg-purple-900/10 ${
                      currentFont.id === font.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 custom:bg-purple-900/20 custom:border-purple-500'
                        : 'border-gray-200 dark:border-gray-700 custom:border-gray-700'
                    }`}
                    style={currentFont.id === font.id ? { fontFamily: font.fontFamily } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{font.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 custom:text-gray-400 mt-1">
                          {font.description}
                        </div>
                      </div>
                      {currentFont.id === font.id && (
                        <div className="w-4 h-4 bg-blue-500 custom:bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 custom:text-gray-400">
                現在のフォント: {currentFont.name}
              </p>
            </div>
          </div>

          {/* キャッシュ管理セクション */}
          <div className="border-t border-gray-200 dark:border-gray-700 custom:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white custom:text-white mb-3">キャッシュ管理</h3>
            
            <div className="space-y-3">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 custom:text-gray-400">
                <div className="flex justify-between">
                  <span>キャッシュサイズ</span>
                  <span className="text-gray-900 dark:text-white custom:text-white">
                    {Math.round(cacheInfo.totalSize / 1024)}KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>キャッシュ数</span>
                  <span className="text-gray-900 dark:text-white custom:text-white">
                    {cacheInfo.cacheNames.length}個
                  </span>
                </div>
                {cacheInfo.lastUpdated && (
                  <div className="flex justify-between">
                    <span>最終更新</span>
                    <span className="text-gray-900 dark:text-white custom:text-white text-xs">
                      {new Date(cacheInfo.lastUpdated).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    const hasUpdates = await checkForUpdates();
                    if (hasUpdates) {
                      if (confirm('アプリの新しいバージョンがあります。今すぐ更新しますか？')) {
                        await forceRefresh();
                      }
                    } else {
                      alert('アプリは最新バージョンです。');
                    }
                  }}
                  disabled={isRefreshing}
                  className="w-full px-3 py-2 text-xs bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 custom:bg-purple-500 custom:hover:bg-purple-600 text-white rounded transition-colors disabled:opacity-50"
                >
                  {isRefreshing ? '更新中...' : '更新チェック'}
                </button>
                
                <button
                  onClick={async () => {
                    if (confirm('キャッシュをクリアして強制更新しますか？\n（ページがリロードされます）')) {
                      await forceRefresh();
                    }
                  }}
                  disabled={isRefreshing}
                  className="w-full px-3 py-2 text-xs bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 custom:bg-orange-500 custom:hover:bg-orange-600 text-white rounded transition-colors disabled:opacity-50"
                >
                  強制更新
                </button>
              </div>
            </div>
          </div>

          {/* アプリ情報セクション */}
          <div className="border-t border-gray-200 dark:border-gray-700 custom:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white custom:text-white mb-3">アプリ情報</h3>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 custom:text-gray-400">
              <div className="flex justify-between">
                <span>バージョン</span>
                <span className="text-gray-900 dark:text-white custom:text-white">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>最終更新</span>
                <span className="text-gray-900 dark:text-white custom:text-white">{dateString}</span>
              </div>
            </div>
          </div>

          {/* 操作説明セクション */}
          <div className="border-t border-gray-200 dark:border-gray-700 custom:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white custom:text-white mb-3">使い方</h3>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 custom:text-gray-400">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 dark:text-blue-400 custom:text-purple-400 font-medium mt-0.5">•</span>
                <span>「新規メモ」でメモを追加</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 dark:text-blue-400 custom:text-purple-400 font-medium mt-0.5">•</span>
                <span>タグをクリックして絞り込み</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 dark:text-blue-400 custom:text-purple-400 font-medium mt-0.5">•</span>
                <span>検索ボックスで素早く検索</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// React.memo() で最適化 - isOpenとonCloseが変わった時のみ再レンダリング
export default memo(SettingsSidebar, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen && 
         prevProps.onClose === nextProps.onClose;
});
