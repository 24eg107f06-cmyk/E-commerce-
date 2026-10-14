import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1, marginBottom: 16 }}>
          404
        </div>
        <h1 className="heading-lg" style={{ color: 'var(--secondary)', marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>
          The page or product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/products" className="btn btn-outline">
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
