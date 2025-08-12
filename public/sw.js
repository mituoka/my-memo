const CACHE_NAME = 'memo-app-v1.0.0';
const BASE_PATH = '/my-memo';

// キャッシュするリソースのリスト
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/static/js/bundle.js`,
  `${BASE_PATH}/static/css/main.css`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`
];

// Service Worker インストール時
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  
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

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }

        // キャッシュにない場合はネットワークから取得
        return fetch(event.request)
          .then((response) => {
            // レスポンスが無効な場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // ネットワークエラーの場合、HTMLページならオフラインページを返す
            if (event.request.mode === 'navigate') {
              return caches.match(`${BASE_PATH}/`);
            }
          });
      })
  );
});

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