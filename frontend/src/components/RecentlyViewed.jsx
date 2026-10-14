import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { History, Trash2 } from 'lucide-react';

export default function RecentlyViewed({ currentProductId, onQuickView }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('myshop_recently_viewed');
      if (stored) {
        let parsed = JSON.parse(stored);
        if (currentProductId) {
          parsed = parsed.filter((p) => p.id !== currentProductId);
        }
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, [currentProductId]);

  const clearHistory = () => {
    localStorage.removeItem('myshop_recently_viewed');
    setItems([]);
  };

  if (!items || items.length === 0) return null;

  return (
    <section style={{ margin: '48px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <History size={22} color="var(--primary)" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
            Continue Exploring
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            (Recently Viewed)
          </span>
        </div>

        <button
          onClick={clearHistory}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
          title="Clear browsing history"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <div className="product-grid">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
}
