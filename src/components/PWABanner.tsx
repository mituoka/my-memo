import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';

export const PWABanner: React.FC = () => {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    updateAvailable, 
    installApp, 
    updateApp 
  } = usePWA();
  
  const [dismissed, setDismissed] = useState(false);

  // バナーを表示する条件
  const shouldShowInstallBanner = isInstallable && !isInstalled && !dismissed;
  const shouldShowUpdateBanner = updateAvailable;
  const shouldShowOfflineBanner = !isOnline;

  if (!shouldShowInstallBanner && !shouldShowUpdateBanner && !shouldShowOfflineBanner) {
    return null;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* オフライン通知 */}
      {shouldShowOfflineBanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#f59e0b',
          color: 'white',
          padding: '0.75rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: '500',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            オフライン モード - 保存されたデータを使用中
          </div>
        </div>
      )}

      {/* アップデート通知 */}
      {shouldShowUpdateBanner && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          background: 'var(--primary)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                アップデートが利用可能です
              </div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                新しい機能と改善が含まれています
              </div>
            </div>
            <button
              onClick={updateApp}
              style={{
                background: 'white',
                color: 'var(--primary)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              更新
            </button>
          </div>
        </div>
      )}

      {/* インストール促進バナー */}
      {shouldShowInstallBanner && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <svg width="24" height="24" fill="var(--primary)" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  アプリをインストール
                </span>
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                ホーム画面に追加してより快適にご利用ください
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setDismissed(true)}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                後で
              </button>
              <button
                onClick={installApp}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                インストール
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};