import { useState, useEffect } from 'react';

interface CacheInfo {
  cacheNames: string[];
  totalSize: number;
  lastUpdated: string | null;
}

export const useCacheManager = () => {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    cacheNames: [],
    totalSize: 0,
    lastUpdated: null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // キャッシュ情報を取得
  const getCacheInfo = async (): Promise<CacheInfo> => {
    if (!('caches' in window)) {
      return { cacheNames: [], totalSize: 0, lastUpdated: null };
    }

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      // 各キャッシュのサイズを推定（正確な計算は難しいため概算）
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        totalSize += keys.length * 50; // 1リクエスト平均50KB程度と仮定
      }

      const lastUpdated = localStorage.getItem('cache_last_updated') || null;

      return {
        cacheNames,
        totalSize,
        lastUpdated
      };
    } catch (error) {
      console.error('Failed to get cache info:', error);
      return { cacheNames: [], totalSize: 0, lastUpdated: null };
    }
  };

  // キャッシュをクリア
  const clearCache = async (): Promise<boolean> => {
    if (!('caches' in window)) {
      return false;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      
      // Service Workerを更新
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        
        // ページをリロード
        window.location.reload();
      }

      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  };

  // アプリを強制更新（キャッシュバスター付き）
  const forceRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    
    try {
      // キャッシュをクリア
      await clearCache();
      
      // タイムスタンプをクエリパラメータに追加してリロード
      const url = new URL(window.location.href);
      url.searchParams.set('_refresh', Date.now().toString());
      window.location.href = url.toString();
    } catch (error) {
      console.error('Force refresh failed:', error);
      setIsRefreshing(false);
    }
  };

  // Service Workerの更新をチェック
  const checkForUpdates = async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return false;
      }

      await registration.update();
      
      // 新しいService Workerが利用可能かチェック
      return registration.waiting !== null;
    } catch (error) {
      console.error('Update check failed:', error);
      return false;
    }
  };

  // Service Workerの更新を適用
  const applyUpdate = async (): Promise<void> => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        // 新しいService Workerに切り替え
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // ページをリロード
        window.location.reload();
      }
    } catch (error) {
      console.error('Apply update failed:', error);
    }
  };

  // 初期化時にキャッシュ情報を取得
  useEffect(() => {
    const loadCacheInfo = async () => {
      const info = await getCacheInfo();
      setCacheInfo(info);
    };
    
    loadCacheInfo();
  }, []);

  // Service Workerの更新イベントを監視
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const handleUpdateFound = () => {
      localStorage.setItem('cache_last_updated', new Date().toISOString());
      getCacheInfo().then(setCacheInfo);
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleUpdateFound);
    
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleUpdateFound);
    };
  }, []);

  return {
    cacheInfo,
    isRefreshing,
    clearCache,
    forceRefresh,
    checkForUpdates,
    applyUpdate,
    getCacheInfo: () => getCacheInfo().then(setCacheInfo)
  };
};