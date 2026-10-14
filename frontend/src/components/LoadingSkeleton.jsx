import React from 'react';

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px' }} />
          <div className="skeleton" style={{ width: '40%', height: 16 }} />
          <div className="skeleton" style={{ width: '85%', height: 20 }} />
          <div className="skeleton" style={{ width: '50%', height: 24 }} />
          <div className="skeleton" style={{ width: '100%', height: 38, borderRadius: '8px', marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="container" style={{ padding: '60px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="skeleton" style={{ width: '30%', height: 20 }} />
        <div className="skeleton" style={{ width: '80%', height: 36 }} />
        <div className="skeleton" style={{ width: '40%', height: 24 }} />
        <div className="skeleton" style={{ width: '50%', height: 32 }} />
        <div className="skeleton" style={{ width: '100%', height: 100 }} />
        <div className="skeleton" style={{ width: '100%', height: 50, borderRadius: '12px', marginTop: 20 }} />
      </div>
    </div>
  );
}
