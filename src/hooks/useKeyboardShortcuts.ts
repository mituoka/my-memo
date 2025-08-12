import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onCancel?: () => void;
  onNew?: () => void;
  onSearch?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions = {}) => {
  const navigate = useNavigate();
  const { onSave, onCancel, onNew, onSearch, enabled = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore shortcuts when typing in input/textarea/contenteditable
    const target = event.target as HTMLElement;
    const isInputElement = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';

    // Ctrl/Cmd + N: New memo
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
      event.preventDefault();
      if (onNew) {
        onNew();
      } else {
        navigate('/memo/new');
      }
      return;
    }

    // Ctrl/Cmd + S: Save (only when not in input)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (onSave) {
        onSave();
      }
      return;
    }

    // Escape: Cancel/Close
    if (event.key === 'Escape') {
      if (onCancel) {
        onCancel();
      }
      return;
    }

    // / (slash): Focus search (only when not in input)
    if (event.key === '/' && !isInputElement) {
      event.preventDefault();
      if (onSearch) {
        onSearch();
      } else {
        // Focus on search input if exists
        const searchInput = document.querySelector('input[placeholder*="検索"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      return;
    }

    // Ctrl/Cmd + /: Show shortcuts help
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault();
      showShortcutsHelp();
      return;
    }
  }, [enabled, onSave, onCancel, onNew, onSearch, navigate]);

  const showShortcutsHelp = () => {
    const shortcuts = [
      'Ctrl+N (⌘N): 新規メモ作成',
      'Ctrl+S (⌘S): メモ保存',
      'Esc: キャンセル/閉じる',
      '/: 検索フォーカス',
      'Ctrl+/ (⌘/): ショートカット一覧表示'
    ];

    alert(`キーボードショートカット:\n\n${shortcuts.join('\n')}`);
  };

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return {
    showShortcutsHelp
  };
};