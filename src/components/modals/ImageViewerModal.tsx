import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  title?: string;
}

function ImageViewerModal({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0, 
  title 
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
      setImageLoadError(false);
    }
  }, [isOpen, initialIndex]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    setIsZoomed(false);
    setImageLoadError(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    setIsZoomed(false);
    setImageLoadError(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case ' ':
          e.preventDefault();
          setIsZoomed(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose]);

  const currentImage = images[currentIndex];

  if (!isOpen || !currentImage) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            {title && (
              <h3 style={{ 
                margin: '0 0 0.25rem 0', 
                fontSize: '1rem', 
                fontWeight: '600' 
              }}>
                {title}
              </h3>
            )}
            <p style={{ 
              margin: 0, 
              fontSize: '0.875rem', 
              opacity: 0.8 
            }}>
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Zoom toggle */}
            <button
              onClick={() => setIsZoomed(prev => !prev)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              title={isZoomed ? 'ズームアウト (Space)' : 'ズームイン (Space)'}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {isZoomed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                )}
              </svg>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              title="閉じる (Esc)"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image container */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: isZoomed ? 'auto' : 'hidden',
          cursor: isZoomed ? 'grab' : 'zoom-in'
        }}>
          {imageLoadError ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              color: 'white',
              opacity: 0.7
            }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p>画像を読み込めませんでした</p>
            </div>
          ) : (
            <img
              src={currentImage}
              alt={`${title || 'Image'} - ${currentIndex + 1}`}
              style={{
                maxWidth: isZoomed ? 'none' : '100%',
                maxHeight: isZoomed ? 'none' : '100%',
                width: isZoomed ? 'auto' : 'auto',
                height: isZoomed ? 'auto' : 'auto',
                objectFit: 'contain',
                transition: 'all 0.3s ease',
                transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                cursor: isZoomed ? 'zoom-out' : 'zoom-in'
              }}
              onClick={() => setIsZoomed(prev => !prev)}
              onError={() => setImageLoadError(true)}
              draggable={false}
            />
          )}

          {/* Navigation arrows - only show if multiple images */}
          {images.length > 1 && (
            <>
              {/* Previous button */}
              <button
                onClick={goToPrevious}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  color: 'white',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
                title="前の画像 (←)"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next button */}
              <button
                onClick={goToNext}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  color: 'white',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
                title="次の画像 (→)"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Footer with thumbnails - only show if multiple images */}
        {images.length > 1 && (
          <div style={{
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
            overflowX: 'auto',
            maxHeight: '100px'
          }}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                  setImageLoadError(false);
                }}
                style={{
                  background: 'none',
                  border: currentIndex === index ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  padding: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: currentIndex === index ? 1 : 0.6
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = currentIndex === index ? '1' : '0.6'}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '2px',
                    display: 'block'
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Help text */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.75rem',
          pointerEvents: 'none'
        }}>
          {images.length > 1 ? '← → で画像切り替え　' : ''}Space でズーム　Esc で閉じる
        </div>
      </div>
    </Modal>
  );
}

export default ImageViewerModal;