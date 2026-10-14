import React from 'react';
import { Link } from 'react-router-dom';
import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { Scale, X, Star, ShoppingCart, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Compare() {
  const { comparedProducts, removeFromCompare, clearCompare } = useComparison();
  const { addToCart } = useCart();

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  if (comparedProducts.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', padding: '50px 32px' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              margin: '0 auto 20px',
            }}
          >
            <Scale size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 8 }}>
            No Products Selected for Comparison
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 24 }}>
            Compare specifications, Smart Scores, pricing, and ratings of up to 4 items side-by-side.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 className="heading-lg" style={{ color: 'var(--secondary)' }}>
            Product Comparison Matrix
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Comparing {comparedProducts.length} items across core specifications and Smart Scores.
          </p>
        </div>

        <button onClick={clearCompare} className="btn btn-outline btn-sm">
          Clear Comparison List
        </button>
      </div>

      <div
        className="card"
        style={{
          padding: 0,
          overflowX: 'auto',
          borderRadius: '16px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 640 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '20px 24px', width: '20%', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Feature / Spec
              </th>
              {comparedProducts.map((p) => (
                <th key={p.id} style={{ padding: '20px', width: `${80 / comparedProducts.length}%`, verticalAlign: 'top' }}>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Remove product"
                    >
                      <X size={14} />
                    </button>
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px', marginBottom: 12 }}
                    />
                    <Link
                      to={`/products/${p.id}`}
                      style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', display: 'block', lineHeight: 1.3 }}
                    >
                      {p.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row 1: Smart Score */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                MyShop Smart Score
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} style={{ padding: '16px 20px' }}>
                  <span className="smart-score-pill" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                    ★ {p.smartScore || 85} / 100
                  </span>
                </td>
              ))}
            </tr>

            {/* Row 2: Price */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                Price & Value
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    {formatPrice(p.price)}
                  </div>
                  {p.discount > 0 && (
                    <span className="badge badge-discount" style={{ marginTop: 4 }}>
                      {p.discount}% OFF
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 3: Customer Rating */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                Rating & Reviews
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 700 }}>{p.rating?.toFixed(1) || '4.5'}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({p.reviewCount || 0})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 4: Brand & Category */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                Brand & Category
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} style={{ padding: '16px 20px', fontSize: '0.9rem' }}>
                  <div><strong>Brand:</strong> {p.brand || 'MYSHOP Atelier'}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{p.categoryName || p.category?.name}</div>
                </td>
              ))}
            </tr>

            {/* Row 5: Stock Availability */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                Availability
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} style={{ padding: '16px 20px' }}>
                  {p.stock > 0 ? (
                    <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.88rem' }}>
                      <CheckCircle2 size={16} /> In Stock ({p.stock} units)
                    </span>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.88rem' }}>
                      Out of Stock
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 6: Colors & Sizes */}
            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 700, color: 'var(--secondary)' }}>
                Options
              </td>
              {comparedProducts.map((p) => (
                <td key={p.id} style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#475569' }}>
                  {p.colors && <div><strong>Colors:</strong> {p.colors}</div>}
                  {p.sizes && <div style={{ marginTop: 4 }}><strong>Sizes:</strong> {p.sizes}</div>}
                  {!p.colors && !p.sizes && <span>Standard size</span>}
                </td>
              ))}
            </tr>

            {/* Row 7: Action */}
            <tr>
              <td style={{ padding: '20px 24px' }}></td>
              {comparedProducts.map((p) => (
                <td key={p.id} style={{ padding: '20px' }}>
                  <button
                    onClick={() => addToCart(p, 1)}
                    disabled={p.stock <= 0}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
