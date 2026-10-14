import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useComparison } from '../context/ComparisonContext';
import {
  ShoppingBag,
  Search,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Package,
  ShieldCheck,
  Menu,
  X,
  Flame,
  Scale,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useComparison();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #4f46e5 100%)',
          color: '#ffffff',
          fontSize: '0.78rem',
          fontWeight: 600,
          textAlign: 'center',
          padding: '6px 12px',
          letterSpacing: '0.02em',
        }}
      >
        <span>✨ Welcome to MYSHOP — Use code <strong>SAVE20</strong> for 20% OFF | Free Delivery above ₹999</span>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 72, gap: 24 }}>
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', color: 'var(--text)' }}
          className="mobile-nav-toggle"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            }}
          >
            <ShoppingBag size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--secondary)',
                lineHeight: 1,
                display: 'block',
              }}
            >
              MY<span style={{ color: 'var(--primary)' }}>SHOP</span>
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Smart Commerce
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="desktop-nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--text)',
            marginLeft: 8,
          }}
        >
          <Link to="/" style={{ color: 'inherit', transition: 'color 0.2s' }}>
            Home
          </Link>
          <Link to="/products" style={{ color: 'inherit', transition: 'color 0.2s' }}>
            Products
          </Link>
          <Link
            to="/products?dealRadar=true"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'var(--deal)',
              transition: 'color 0.2s',
            }}
          >
            <Flame size={16} /> Deal Radar
          </Link>
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            maxWidth: 420,
            position: 'relative',
            marginLeft: 'auto',
          }}
          className="desktop-search"
        >
          <input
            type="text"
            placeholder="Search electronics, fashion, footwear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 42px 10px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg)',
              outline: 'none',
              fontSize: '0.88rem',
              color: 'var(--text)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Compare Link */}
          {compareCount > 0 && (
            <Link
              to="/compare"
              className="btn btn-outline btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
              }}
              title="Compare Products"
            >
              <Scale size={16} />
              <span>Compare</span>
              <span
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  padding: '1px 6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {compareCount}
              </span>
            </Link>
          )}

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="icon-action-btn"
            style={{ position: 'relative' }}
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--deal)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  minWidth: 18,
                  height: 18,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="icon-action-btn"
            style={{ position: 'relative' }}
            title="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  minWidth: 18,
                  height: 18,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.4)',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Auth / Profile Dropdown */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="user-name-label" style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.fullName}
                </span>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      backgroundColor: 'var(--surface)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border)',
                      minWidth: 200,
                      zIndex: 95,
                      overflow: 'hidden',
                      animation: 'slideUp 0.15s ease',
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{user.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      {isAdmin && (
                        <span
                          style={{
                            marginTop: 4,
                            display: 'inline-block',
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          ADMIN
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '6px 0' }}>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 16px',
                          fontSize: '0.85rem',
                          color: 'var(--text)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <User size={16} color="var(--primary)" /> Profile & Insights
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 16px',
                          fontSize: '0.85rem',
                          color: 'var(--text)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-alt)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Package size={16} color="var(--primary)" /> My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 16px',
                            fontSize: '0.85rem',
                            color: '#1d4ed8',
                            fontWeight: 600,
                            backgroundColor: '#eff6ff',
                            transition: 'background 0.15s',
                          }}
                        >
                          <ShieldCheck size={16} /> Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 16px',
                          fontSize: '0.85rem',
                          color: 'var(--deal)',
                          textAlign: 'left',
                          transition: 'background 0.15s',
                          borderTop: '1px solid var(--border-light)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm register-btn-nav">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ borderRadius: 'var(--radius-full)', paddingRight: 40 }}
            />
            <button
              type="submit"
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
            >
              <Search size={18} color="var(--text-muted)" />
            </button>
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}
          >
            All Products
          </Link>
          <Link
            to="/products?dealRadar=true"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontWeight: 600,
              padding: '8px 0',
              borderBottom: '1px solid var(--border-light)',
              color: 'var(--deal)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Flame size={16} /> Deal Radar
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0' }}
          >
            Product Comparison ({compareCount})
          </Link>
        </div>
      )}

      {/* Media query helpers */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-links, .desktop-search, .register-btn-nav, .user-name-label {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
