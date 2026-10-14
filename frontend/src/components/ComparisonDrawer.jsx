import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export default function ComparisonDrawer() {
  const { comparedProducts, removeFromCompare, clearCompare } = useComparison();

  if (comparedProducts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        borderRadius: '16px',
        padding: '12px 20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        maxWidth: 720,
        width: '92%',
        animation: 'slideUp 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Scale size={18} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
            Compare ({comparedProducts.length}/4)
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Side-by-side analysis
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: 8, flex: 1, overflowX: 'auto', padding: '2px 0' }}>
        {comparedProducts.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'relative',
              width: 44,
              height: 44,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#334155',
              flexShrink: 0,
            }}
          >
            <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              onClick={() => removeFromCompare(p.id)}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '50%',
                width: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
              title="Remove"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={clearCompare}
          style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'underline' }}
        >
          Clear
        </button>
        <Link
          to="/compare"
          className="btn btn-primary btn-sm"
          style={{ padding: '8px 16px', borderRadius: '10px' }}
        >
          Compare <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
