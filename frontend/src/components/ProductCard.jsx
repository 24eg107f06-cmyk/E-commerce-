import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useComparison } from '../context/ComparisonContext';
import { Heart, Eye, Scale, Star, ShoppingCart, Flame, Check } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function ProductCard({ product, onQuickView }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isInCompare, addToCompare } = useComparison();

  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    const success = await addToCart(product, 1);
    setAddingToCart(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="product-card">
      {/* Top Image Wrap */}
      <div className="product-card-image-wrap">
        <Link to={`/products/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card-image"
            loading="lazy"
            onError={handleImageError}
          />
        </Link>

        {/* Top-Left Badges */}
        <div className="product-card-badges">
          {product.isDealRadar && (
            <span className="badge badge-deal">
              <Flame size={12} /> Deal Radar
            </span>
          )}
          {product.discount > 0 && (
            <span className="badge badge-discount">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Top-Right Action Buttons */}
        <div className="product-card-actions">
          <button
            onClick={() => toggleWishlist(product)}
            className={`icon-action-btn ${inWishlist ? 'active' : ''}`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart size={18} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : 'currentColor'} />
          </button>

          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="icon-action-btn"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye size={18} />
            </button>
          )}

          <button
            onClick={() => addToCompare(product)}
            className={`icon-action-btn ${inCompare ? 'active' : ''}`}
            title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
            aria-label="Compare"
            style={inCompare ? { backgroundColor: '#eff6ff', color: 'var(--primary)' } : {}}
          >
            <Scale size={18} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="product-card-body">
        {/* Category & Smart Score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="product-card-category">
            {product.categoryName || product.category?.name || 'Category'}
          </span>
          <span className="smart-score-pill" title="MyShop Smart Score calculated from rating, reviews, discount and stock">
            ★ {product.smartScore || 85} Score
          </span>
        </div>

        {/* Product Title */}
        <Link to={`/products/${product.id}`} className="product-card-title" title={product.name}>
          {product.name}
        </Link>

        {/* Rating & Review Count */}
        <div className="product-card-rating">
          <div className="stars">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{product.rating?.toFixed(1) || '4.5'}</span>
          </div>
          <span>({product.reviewCount || 0} reviews)</span>
        </div>

        {/* Pricing */}
        <div className="product-card-pricing">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock Urgency Indicator */}
        {product.stock <= 5 && product.stock > 0 ? (
          <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>🔥 Only {product.stock} left in stock</span>
          </div>
        ) : product.stock <= 0 ? (
          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
            Out of Stock
          </div>
        ) : (
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>
            In Stock
          </div>
        )}

        {/* Footer Button */}
        <div className="product-card-footer">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || addingToCart}
            className={`btn ${justAdded ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added to Cart
              </>
            ) : addingToCart ? (
              'Adding...'
            ) : product.stock <= 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
