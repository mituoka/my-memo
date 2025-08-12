const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `memo-app-v${CACHE_VERSION}`;
const BASE_PATH = '/my-memo';

// キャッシュ戦略の設定
const CACHE_STRATEGIES = {
  // 即座に更新が必要なリソース（APIやHTML）
  NETWORK_FIRST: 'network-first',
  // 静的リソース（JS、CSS、画像）
  CACHE_FIRST: 'cache-first',
  // マニフェストなど（たまに更新される）
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// キャッシュするリソースのリスト（初期キャッシュ）
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/icon-192.svg`,
  `${BASE_PATH}/icon-512.svg`
];

// リソースタイプ別のキャッシュ戦略
const getCacheStrategy = (url) => {
  if (url.includes('/static/')) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  if (url.includes('manifest.json') || url.includes('.svg') || url.includes('.png')) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  if (url.includes('/api/') || url.includes('index.html')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
};

// Service Worker インストール時
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install', `Version: ${CACHE_VERSION}`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
  
  // 新しいService Workerを即座にアクティブにする
  self.skipWaiting();
});

// Service Worker アクティブ時
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 古いキャッシュを削除
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 新しいService Workerをすべてのクライアントで使用
      return self.clients.claim();
    })
  );
});

// ネットワークリクエストの処理
self.addEventListener('fetch', (event) => {
  // GitHub Pages環境でのみ動作するように制限
  if (!event.request.url.includes(BASE_PATH)) {
    return;
  }

  const strategy = getCacheStrategy(event.request.url);
  
  switch (strategy) {
    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(networkFirst(event.request));
      break;
    case CACHE_STRATEGIES.CACHE_FIRST:
      event.respondWith(cacheFirst(event.request));
      break;
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(staleWhileRevalidate(event.request));
      break;
    default:
      event.respondWith(staleWhileRevalidate(event.request));
  }
});

// ネットワーク優先戦略
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    }
  } catch (error) {
    console.log('Network failed, trying cache:', error);
  }
  
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // オフライン用フォールバック
  if (request.mode === 'navigate') {
    return caches.match(`${BASE_PATH}/`);
  }
  
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

// キャッシュ優先戦略
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Cache and network failed:', error);
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Stale While Revalidate戦略
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // バックグラウンドで更新
  const fetchPromise = fetch(request).then(response => {
    if (response && response.status === 200) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(error => {
    console.log('Background fetch failed:', error);
    return cachedResponse;
  });
  
  // キャッシュがあればすぐ返す、なければネットワークを待つ
  return cachedResponse || fetchPromise;
}

// プッシュ通知の処理（将来の拡張用）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: `${BASE_PATH}/icon-192.png`,
      badge: `${BASE_PATH}/icon-192.png`,
      tag: 'memo-notification',
      data: data.url
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 通知クリック時の処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// バックグラウンド同期（将来の拡張用）
self.addEventListener('sync', (event) => {
  if (event.tag === 'memo-sync') {
    event.waitUntil(syncMemos());
  }
});

// メモ同期の実装（プレースホルダー）
async function syncMemos() {
  try {
    // 将来的にはここでサーバーとの同期処理を実装
    console.log('Background sync: Memos synced');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// メッセージハンドラー（アプリからのメッセージを処理）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // 新しいService Workerを即座にアクティブにする
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    // バージョン情報を返す
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: CACHE_VERSION,
      cacheName: CACHE_NAME
    });
  }
});