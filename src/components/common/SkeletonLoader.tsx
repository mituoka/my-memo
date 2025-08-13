import React from 'react';

interface SkeletonProps {
  readonly width?: string | number;
  readonly height?: string | number;
  readonly borderRadius?: string | number;
  readonly className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = ''
}) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius,
      background: 'var(--skeleton-base)',
      position: 'relative',
      overflow: 'hidden'
    }}
  />
);

interface MemoCardSkeletonProps {
  readonly showImage?: boolean;
}

export const MemoCardSkeleton: React.FC<MemoCardSkeletonProps> = ({ 
  showImage = Math.random() > 0.5 
}) => (
  <div className="card" style={{ padding: '1.5rem' }}>
    {/* Image placeholder */}
    {showImage && (
      <div style={{ marginBottom: '1rem' }}>
        <Skeleton height="200px" borderRadius="6px" />
      </div>
    )}
    
    {/* Header */}
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <Skeleton width="70%" height="1.125rem" />
        <Skeleton width="16px" height="16px" borderRadius="50%" />
      </div>
      <Skeleton width="100%" height="0.875rem" />
      <Skeleton width="85%" height="0.875rem" style={{ marginTop: '0.25rem' }} />
    </div>
    
    {/* Tags */}
    <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Skeleton width="60px" height="20px" borderRadius="10px" />
      <Skeleton width="80px" height="20px" borderRadius="10px" />
      {Math.random() > 0.5 && <Skeleton width="45px" height="20px" borderRadius="10px" />}
    </div>
    
    {/* Footer */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Skeleton width="120px" height="0.8125rem" />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Skeleton width="40px" height="32px" borderRadius="6px" />
        <Skeleton width="40px" height="32px" borderRadius="6px" />
      </div>
    </div>
  </div>
);

interface MemoGridSkeletonProps {
  readonly count?: number;
}

export const MemoGridSkeleton: React.FC<MemoGridSkeletonProps> = ({ count = 6 }) => (
  <div className="grid-responsive">
    {Array.from({ length: count }, (_, i) => (
      <MemoCardSkeleton key={i} />
    ))}
  </div>
);

interface SearchSkeletonProps {}

export const SearchSkeleton: React.FC<SearchSkeletonProps> = () => (
  <div style={{
    border: '1px solid var(--border)',
    borderRadius: '8px',
    background: 'var(--surface)',
    marginBottom: '1rem'
  }}>
    <div style={{ padding: '1rem' }}>
      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
        <Skeleton height="44px" borderRadius="6px" />
      </div>
      
      {/* Control buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Skeleton width="100px" height="36px" borderRadius="6px" />
        <Skeleton width="80px" height="36px" borderRadius="6px" />
        <Skeleton width="60px" height="36px" borderRadius="6px" />
      </div>
    </div>
  </div>
);

export default Skeleton;