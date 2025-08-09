import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMemoStorage } from '../hooks/useMemoStorage';
import { useBackup } from '../hooks/useBackup';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'theme' | 'backup';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { memos, importMemos } = useMemoStorage();
  const { exportToJSON, triggerImport } = useBackup();
  const [activeTab, setActiveTab] = useState<TabType>('theme');

  if (!isOpen) return null;

  const handleExport = () => {
    exportToJSON(memos);
  };

  const handleImport = async () => {
    const backupData = await triggerImport();
    if (backupData) {
      const shouldReplace = window.confirm(
        `${backupData.totalCount}件のメモをインポートします。\n\n` +
        `「OK」: 既存データに追加\n` +
        `「キャンセル」: 全て置き換える場合は、再度お試しください`
      );
      
      if (shouldReplace) {
        const addedCount = importMemos(backupData.memos, false);
        alert(`${addedCount}件の新しいメモを追加しました`);
      } else {
        const confirmReplace = window.confirm(
          '本当に全てのメモを置き換えますか？\n既存のメモは全て削除されます。'
        );
        if (confirmReplace) {
          importMemos(backupData.memos, true);
          alert(`${backupData.totalCount}件のメモで置き換えました`);
        }
      }
    }
  };

  const tabs = [
    { id: 'theme' as TabType, label: '🌓 テーマ', icon: '🌓' },
    { id: 'backup' as TabType, label: '💾 バックアップ', icon: '💾' }
  ];

  return (
    <>
      {/* オーバーレイ */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
        onClick={onClose}
      />
      
      {/* 設定パネル */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1001,
          width: '90vw',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            ⚙️ 設定
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            ✕
          </button>
        </div>

        {/* タブナビゲーション */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            background: 'var(--background)'
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem',
                background: activeTab === tab.id ? 'var(--surface)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* タブコンテンツ */}
        <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          
          {/* テーマ設定 */}
          {activeTab === 'theme' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                🌓 テーマ設定
              </h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={toggleTheme}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem'
                  }}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                  {theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                現在のテーマ: <strong>{theme === 'light' ? 'ライト' : 'ダーク'}モード</strong>
              </p>
            </div>
          )}


          {/* バックアップ設定 */}
          {activeTab === 'backup' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                💾 バックアップ・復元
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <button
                  onClick={handleExport}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    padding: '1rem'
                  }}
                >
                  📤 エクスポート ({memos.length}件のメモ)
                </button>
                
                <button
                  onClick={handleImport}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    padding: '1rem'
                  }}
                >
                  📥 インポート
                </button>
              </div>

              <div
                style={{
                  background: 'var(--background)',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  💡 バックアップについて
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  <li>メモデータをJSONファイルでダウンロード</li>
                  <li>デバイス間でのデータ移行が可能</li>
                  <li>インポート時は追加または全置換を選択可能</li>
                </ul>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};