import React from 'react';
import { BackgroundSettings } from '../../contexts/BackgroundContext';

interface PresetOption {
  id: string;
  name: string;
  thumbnail: string;
}

interface BackgroundMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BackgroundSettings;
  onSettingsUpdate: (updates: Partial<BackgroundSettings>) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPresetSelect: (presetId: string) => void;
  onReset: () => void;
  presets: PresetOption[];
}

function BackgroundMenu({
  isOpen,
  onClose,
  settings,
  onSettingsUpdate,
  onImageUpload,
  onPresetSelect,
  onReset,
  presets
}: BackgroundMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'default'
        }}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: '6rem',
          marginTop: '0.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          minWidth: '280px',
          maxHeight: '400px',
          overflow: 'auto'
        }}
      >
        {/* カスタム画像アップロード */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <label
            htmlFor="background-upload"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}
          >
            背景画像
          </label>
          <input
            id="background-upload"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            JPG, PNG, GIF (最大5MB)
          </p>
        </div>

        {/* プリセット背景 */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => onPresetSelect(preset.id)}
                style={{
                  padding: '0.5rem',
                  border: settings.presetId === preset.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: '4px',
                  background: preset.thumbnail,
                  height: '40px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                title={preset.name}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontSize: '0.625rem',
                    padding: '0.125rem 0.25rem',
                    textAlign: 'center'
                  }}
                >
                  {preset.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 透明度・ブラー設定 */}
        {settings.type !== 'none' && (
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                透明度: {Math.round(settings.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.opacity}
                onChange={(e) => onSettingsUpdate({ opacity: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                ブラー: {settings.blur}px
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={settings.blur}
                onChange={(e) => onSettingsUpdate({ blur: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* リセットボタン */}
        <div style={{ padding: '1rem' }}>
          <button
            onClick={onReset}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem'}}>
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
            背景をリセット
          </button>
        </div>
      </div>
    </>
  );
}

export default BackgroundMenu;