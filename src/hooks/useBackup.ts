import { Memo } from '../types';

export interface BackupData {
  version: string;
  timestamp: string;
  memos: Memo[];
  totalCount: number;
}

export const useBackup = () => {
  // JSONエクスポート機能
  const exportToJSON = (memos: Memo[]) => {
    const backupData: BackupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      memos: memos,
      totalCount: memos.length
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // ダウンロード
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `memo-backup-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return backupData;
  };

  // JSONインポート機能
  const importFromJSON = (file: File): Promise<BackupData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const backupData: BackupData = JSON.parse(content);
          
          // データの検証
          if (!backupData.version || !backupData.memos || !Array.isArray(backupData.memos)) {
            throw new Error('無効なバックアップファイルです');
          }

          // メモデータの検証
          for (const memo of backupData.memos) {
            if (!memo.id || !memo.title || !memo.createdAt || !memo.updatedAt || !Array.isArray(memo.tags)) {
              throw new Error('メモデータの形式が正しくありません');
            }
          }

          resolve(backupData);
        } catch (error) {
          reject(new Error(`ファイルの読み込みに失敗しました: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('ファイルの読み込みに失敗しました'));
      };

      reader.readAsText(file);
    });
  };

  // ファイル選択トリガー
  const triggerImport = (): Promise<BackupData | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const backupData = await importFromJSON(file);
            resolve(backupData);
          } catch (error) {
            alert(error instanceof Error ? error.message : 'インポートに失敗しました');
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      input.click();
    });
  };

  return {
    exportToJSON,
    importFromJSON,
    triggerImport
  };
};