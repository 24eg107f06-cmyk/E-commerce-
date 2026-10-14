import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, appliedCoupon } = useCart();
  const { addToast } = useToast();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim());
    setApplyingCoupon(false);
    setCouponCodeInput('');
  };

  // Empty State
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            backgroundColor: 'var(--surface)',
            padding: '50px 32px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
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
              margin: '0 auto 24px',
            }}
          >
            <ShoppingBag size={40} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 8 }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 28 }}>
            Your cart is waiting for something amazing. Discover trending products and incredible deals today.
          </p>

          <Link to="/products" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <h1 className="heading-lg" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
        Shopping Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
        Review your items, apply promotional vouchers, and proceed to seamless checkout.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: 36 }} className="cart-layout">
        {/* =========================================================
            ITEMS LIST
            ========================================================= */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: 20,
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: 20,
                  alignItems: 'center',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div>
                  <Link
                    to={`/products/${item.productId}`}
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      lineHeight: 1.3,
                      display: 'block',
                      marginBottom: 6,
                    }}
                  >
                    {item.productName}
                  </Link>

                  <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                    {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                    {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)' }}>
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg)',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '6px 10px', color: 'var(--text)' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '0.9rem', minWidth: 24, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock || 99)}
                      style={{ padding: '6px 10px', color: 'var(--text)' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.8rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--deal)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <Link to="/products" className="btn btn-outline btn-sm">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* =========================================================
            ORDER SUMMARY CARD
            ========================================================= */}
        <div>
          <div className="card" style={{ padding: 28, position: 'sticky', top: 96 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 20 }}>
              Order Summary
            </h3>

            {/* Coupon Box */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag size={16} color="var(--primary)" /> Have a coupon?
              </div>

              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#d1fae5',
                    border: '1px solid #a7f3d0',
                    color: '#065f46',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', fontWeight: 700 }}>
                    <CheckCircle2 size={16} /> {appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="e.g. SAVE20, MYSHOP10"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="form-control"
                    style={{ padding: '8px 12px', fontSize: '0.85rem', textTransform: 'uppercase' }}
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCodeInput.trim()}
                    className="btn btn-secondary btn-sm"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Sample Coupons Tip */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                Try: <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setCouponCodeInput('SAVE20')}>SAVE20</span> (20% off) or <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setCouponCodeInput('MYSHOP10')}>MYSHOP10</span> (10% off)
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatPrice(cart.subtotal)}</span>
              </div>

              {cart.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#10b981' }}>
                  <span>Coupon Discount</span>
                  <span style={{ fontWeight: 700 }}>-{formatPrice(cart.discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <span>Delivery</span>
                <span>
                  {cart.deliveryAmount === 0 ? (
                    <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                  ) : (
                    formatPrice(cart.deliveryAmount)
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <span>Estimated Tax (5% GST)</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatPrice(cart.taxAmount)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--secondary)',
                  borderTop: '2px solid var(--border)',
                  paddingTop: 16,
                  marginTop: 4,
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{formatPrice(cart.totalAmount)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: 16 }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            {/* Guarantees */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={14} color="#10b981" /> Safe & 256-bit encrypted checkout
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={14} color="var(--primary)" /> Dispatched within 24 hours
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
