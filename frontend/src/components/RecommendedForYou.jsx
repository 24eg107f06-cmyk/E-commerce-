import React, { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export default function RecommendedForYou({ onQuickView }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Smart recommendation: Fetch top smart score items or featured items
        const res = await productsApi.getTopSmartScore();
        const list = res?.data?.data || res?.data || [];
        if (Array.isArray(list)) {
          setRecommendations(list.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading || !recommendations || recommendations.length === 0) return null;

  return (
    <section style={{ margin: '48px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Sparkles size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
            Picked For You
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Smart recommendations based on ratings, reviews, value, and current trends.
          </p>
        </div>
      </div>

      <div className="product-grid">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </section>
  );
}
