import React from 'react';
import Modal from '../common/Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isLoading?: boolean;
}

function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  isLoading = false 
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ 
          marginBottom: '1.5rem',
          fontSize: '3rem',
          color: '#ef4444'
        }}>
          ⚠️
        </div>
        
        <h2 style={{ 
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          メモを削除しますか？
        </h2>
        
        <p style={{ 
          marginBottom: '1.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          lineHeight: 1.5
        }}>
          「{title}」を削除します。<br/>
          この操作は取り消すことができません。
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          justifyContent: 'center' 
        }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            キャンセル
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              background: '#ef4444',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              opacity: isLoading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading && (
              <div style={{
                width: '14px',
                height: '14px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            削除する
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmModal;