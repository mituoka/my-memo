import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Service Worker 登録
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // PWAインストールプロンプトの処理
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // インストール完了の検知
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // オンライン/オフライン状態の監視
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // イベントリスナーの追加
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 既にインストール済みかチェック
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/my-memo/sw.js', {
        scope: '/my-memo/'
      });

      console.log('Service Worker registered:', registration);

      // アップデートの検知
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });

      // Service Workerからのメッセージ受信
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const installApp = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during app installation:', error);
    }
  };

  const updateApp = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration('/my-memo/');
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            icon: '/my-memo/icon-192.png',
            badge: '/my-memo/icon-192.png',
            ...options
          });
        });
      }
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    installApp,
    updateApp,
    requestNotificationPermission,
    showNotification
  };
};