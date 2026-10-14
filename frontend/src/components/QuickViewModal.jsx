import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { X, Star, Heart, ShoppingCart, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product?.sizes) {
      const parts = product.sizes.split(',');
      return parts[0]?.trim();
    }
    return null;
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    if (product?.colors) {
      const parts = product.colors.split(',');
      return parts[0]?.trim();
    }
    return null;
  });
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const images = [product.imageUrl];
  if (product.additionalImages) {
    product.additionalImages.split(',').forEach((img) => {
      const trimmed = img.trim();
      if (trimmed && !images.includes(trimmed)) {
        images.push(trimmed);
      }
    });
  }

  const sizes = product.sizes ? product.sizes.split(',').map((s) => s.trim()) : [];
  const colors = product.colors ? product.colors.split(',').map((c) => c.trim()) : [];

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity, selectedSize, selectedColor);
    if (success) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        onClose();
      }, 1200);
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840, padding: 32 }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: '#64748b',
            padding: 8,
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Images Gallery */}
          <div>
            <div
              style={{
                aspectRatio: '1/1',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border)',
                marginBottom: 12,
              }}
            >
              <img
                src={selectedImage || product.imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={handleImageError}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                {product.categoryName || product.category?.name}
              </span>
              <span className="smart-score-pill">★ {product.smartScore || 85} Smart Score</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 10, color: 'var(--text)' }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div className="stars">
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#0f172a', marginLeft: 4 }}>{product.rating?.toFixed(1) || '4.5'}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.reviewCount || 0} reviews)</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="badge badge-discount">{product.discount}% OFF</span>
                </>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: 20 }}>
              {product.description?.substring(0, 160)}...
            </p>

            {/* Color Selector */}
            {colors.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>
                  Color: <span style={{ color: 'var(--primary)' }}>{selectedColor}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: selectedColor === c ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedColor === c ? 'var(--primary-light)' : 'var(--surface)',
                        color: selectedColor === c ? 'var(--primary)' : 'var(--text)',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>
                  Size: <span style={{ color: 'var(--primary)' }}>{selectedSize}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: selectedSize === s ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: selectedSize === s ? 'var(--primary-light)' : 'var(--surface)',
                        color: selectedSize === s ? 'var(--primary)' : 'var(--text)',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text)' }}
                >
                  -
                </button>
                <span style={{ padding: '0 10px', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text)' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`btn ${justAdded ? 'btn-secondary' : 'btn-primary'}`}
                style={{ flex: 1 }}
              >
                {justAdded ? (
                  <>
                    <Check size={18} /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`btn btn-outline ${inWishlist ? 'active' : ''}`}
                style={{ padding: '12px' }}
                title="Wishlist"
              >
                <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : 'currentColor'} />
              </button>
            </div>

            <Link
              to={`/products/${product.id}`}
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 16,
                fontSize: '0.85rem',
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              View Full Product Details & Reviews <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
