import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import ProductCard from './ProductCard';

export default function DealRadarSection({ deals = [], onQuickView }) {
  // Simulated countdown timer for urgency (e.g. resets every 6 hours)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!deals || deals.length === 0) return null;

  return (
    <section
      style={{
        padding: '50px 0',
        background: 'linear-gradient(180deg, #fff1f2 0%, #fff7ed 100%)',
        borderRadius: '24px',
        margin: '40px 0',
        border: '1px solid #fed7aa',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        {/* Header with Urgency Timer */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ef4444 0%, #ea580c 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
              }}
            >
              <Flame size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#991b1b', letterSpacing: '-0.02em' }}>
                  Deal Radar
                </h2>
                <span
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                  }}
                >
                  Live Scanner
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#c2410c' }}>
                High-discount, high-rated gems with rapidly dropping inventory levels.
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'white',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #fdba74',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.1)',
            }}
          >
            <Clock size={18} color="#ea580c" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9a3412' }}>Radar Resets in:</span>
            <div style={{ display: 'flex', gap: 4, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: '#ea580c' }}>
              <span style={{ background: '#ffedd5', padding: '2px 6px', borderRadius: 4 }}>
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              :
              <span style={{ background: '#ffedd5', padding: '2px 6px', borderRadius: 4 }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              :
              <span style={{ background: '#ffedd5', padding: '2px 6px', borderRadius: 4 }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div className="product-grid">
          {deals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            to="/products?dealRadar=true"
            className="btn btn-outline"
            style={{
              borderColor: '#ea580c',
              color: '#c2410c',
              backgroundColor: 'white',
              fontWeight: 700,
            }}
          >
            View All Deal Radar Offers <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
