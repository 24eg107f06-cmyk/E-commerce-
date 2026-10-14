import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Mail, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        paddingTop: 60,
        paddingBottom: 30,
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div className="container">
        {/* Value Propositions Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
            paddingBottom: 40,
            marginBottom: 40,
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <Truck size={22} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>Free Fast Delivery</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>On all orders above ₹999</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>100% Genuine Products</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Curated with verified Smart Scores</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>Hassle-Free Returns</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>7-day seamless replacement guarantee</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 36,
            marginBottom: 40,
          }}
        >
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <ShoppingBag size={20} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                MY<span style={{ color: '#3b82f6' }}>SHOP</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16, color: '#94a3b8' }}>
              Discover. Choose. Shop Smarter. A next-generation shopping platform built with Spring Boot, React, and intelligent product evaluation.
            </p>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong>Support:</strong> support@myshop.com
            </div>
          </div>

          {/* Quick Shop */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Shop Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
              <li><Link to="/products?category=electronics" style={{ color: 'inherit', transition: 'color 0.2s' }}>Electronics & Audio</Link></li>
              <li><Link to="/products?category=fashion" style={{ color: 'inherit', transition: 'color 0.2s' }}>Apparel & Streetwear</Link></li>
              <li><Link to="/products?category=footwear" style={{ color: 'inherit', transition: 'color 0.2s' }}>Footwear & Sneakers</Link></li>
              <li><Link to="/products?category=accessories" style={{ color: 'inherit', transition: 'color 0.2s' }}>Luxury Accessories</Link></li>
              <li><Link to="/products?dealRadar=true" style={{ color: '#ef4444', fontWeight: 600 }}>🔥 Deal Radar</Link></li>
            </ul>
          </div>

          {/* Customer Experience */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Customer Experience</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
              <li><Link to="/orders" style={{ color: 'inherit' }}>Order Tracking Timeline</Link></li>
              <li><Link to="/compare" style={{ color: 'inherit' }}>Product Comparison Matrix</Link></li>
              <li><Link to="/profile" style={{ color: 'inherit' }}>Shopping Insights Dashboard</Link></li>
              <li><Link to="/cart" style={{ color: 'inherit' }}>Cart & Coupon Discounts</Link></li>
              <li><Link to="/wishlist" style={{ color: 'inherit' }}>Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>Stay in the Loop</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 16 }}>
              Receive exclusive promo drops, Deal Radar alerts, and newly curated products.
            </p>
            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: '0.88rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> You're on the list! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '8px', padding: '10px 16px' }}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} MYSHOP Inc. All rights reserved. Crafted for Excellence.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>UPI / RuPay / Cards Accepted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
