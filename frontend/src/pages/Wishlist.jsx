import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  if (!wishlist.items || wishlist.items.length === 0) {
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
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--deal)',
              margin: '0 auto 24px',
            }}
          >
            <Heart size={40} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: 8 }}>
            Your Wishlist is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 28 }}>
            Save products you love and return anytime to move them to your bag.
          </p>

          <Link to="/products" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Explore Trending Products <ArrowRight size={18} />
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
            My Wishlist ({wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'})
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Saved items available for quick cart migration.
          </p>
        </div>

        <Link to="/products" className="btn btn-outline btn-sm">
          Continue Shopping
        </Link>
      </div>

      <div className="product-grid">
        {wishlist.items.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-card-image-wrap">
              <Link to={`/products/${item.productId}`}>
                <img src={item.productImageUrl} alt={item.productName} className="product-card-image" />
              </Link>
              <button
                onClick={() => removeFromWishlist(item.productId || item.id)}
                className="icon-action-btn active"
                style={{ position: 'absolute', top: 12, right: 12 }}
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="product-card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="product-card-category">{item.categoryName || 'Item'}</span>
                <span className="smart-score-pill">★ {item.smartScore || 85} Score</span>
              </div>

              <Link to={`/products/${item.productId}`} className="product-card-title">
                {item.productName}
              </Link>

              <div className="product-card-pricing">
                <span className="current-price">{formatPrice(item.price)}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="original-price">{formatPrice(item.originalPrice)}</span>
                )}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                <button
                  onClick={() => moveToCart(item)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <ShoppingCart size={16} /> Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
