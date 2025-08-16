import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardNavigation = () => {
  const navigate = useNavigate();

  const navigateToNextMemo = useCallback((direction: 'next' | 'prev') => {
    const memoCards = Array.from(document.querySelectorAll('.memo-card')) as HTMLElement[];
    if (memoCards.length === 0) return;

    const currentIndex = memoCards.findIndex(card => 
      card === document.activeElement || card.contains(document.activeElement)
    );

    let nextIndex = 0;
    if (direction === 'next') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % memoCards.length;
    } else {
      nextIndex = currentIndex === -1 ? 0 : currentIndex === 0 ? memoCards.length - 1 : currentIndex - 1;
    }

    const nextCard = memoCards[nextIndex];
    if (nextCard) {
      nextCard.focus();
      nextCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Cmd/Ctrl + K でグローバル検索にフォーカス
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.querySelector('input[placeholder*="検索"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Cmd/Ctrl + N で新規メモ作成
    if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
      event.preventDefault();
      navigate('/memo/new');
    }

    // ESC で検索をクリア、モーダルを閉じる
    if (event.key === 'Escape') {
      // アクティブな要素がinputの場合、フォーカスを外す
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        activeElement.blur();
        return;
      }

      // 検索入力をクリア
      const searchInput = document.querySelector('input[placeholder*="検索"]') as HTMLInputElement;
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      // 詳細検索パネルが開いている場合は閉じる
      const detailSearchButton = document.querySelector('button:has(svg):has-text("詳細検索")') as HTMLButtonElement;
      if (detailSearchButton) {
        // パネルが開いているかチェック（実装によって調整が必要）
        detailSearchButton.click();
      }
    }

    // ? でヘルプを表示
    if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
      const activeElement = document.activeElement;
      // 入力フィールドにフォーカスがない場合のみ
      if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        // ヘルプモーダルを表示（ShortcutsHelpコンポーネント）
        const helpButton = document.querySelector('button[title*="ヘルプ"]') as HTMLButtonElement;
        if (helpButton) {
          helpButton.click();
        }
      }
    }

    // Tab navigation の改善
    if (event.key === 'Tab') {
      // フォーカス可能な要素を取得
      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    // J/K でメモ間を移動
    if (!event.metaKey && !event.ctrlKey && !event.altKey) {
      const activeElement = document.activeElement;
      // 入力フィールドにフォーカスがない場合のみ
      if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
        if (event.key === 'j') {
          // 次のメモカードに移動
          event.preventDefault();
          navigateToNextMemo('next');
        }
        if (event.key === 'k') {
          // 前のメモカードに移動
          event.preventDefault();
          navigateToNextMemo('prev');
        }
      }
    }

    // Enter でフォーカスされたメモカードを開く
    if (event.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement?.classList.contains('memo-card') || activeElement?.closest('.memo-card')) {
        event.preventDefault();
        const memoCard = activeElement.closest('.memo-card') as HTMLElement || activeElement;
        const editButton = memoCard.querySelector('a[href*="/memo/edit/"]') as HTMLAnchorElement;
        if (editButton) {
          editButton.click();
        }
      }
    }
  }, [navigate, navigateToNextMemo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    // 必要に応じてヘルパー関数を公開
    navigateToNextMemo
  };
};