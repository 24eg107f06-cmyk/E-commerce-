import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi, reviewsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useComparison } from '../context/ComparisonContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { DetailsSkeleton } from '../components/LoadingSkeleton';
import { handleImageError } from '../utils/imageFallback';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Scale,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Flame,
  Award,
  Send,
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useComparison();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction states
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const [prodRes, relRes, revRes] = await Promise.all([
          productsApi.getById(id),
          productsApi.getRelated(id),
          reviewsApi.getByProduct(id),
        ]);

        const p = prodRes?.data?.data || prodRes?.data;
        if (p) {
          setProduct(p);
          setSelectedImage(p.imageUrl);

          if (p.sizes) {
            const sizeArr = p.sizes.split(',');
            setSelectedSize(sizeArr[0]?.trim());
          }
          if (p.colors) {
            const colorArr = p.colors.split(',');
            setSelectedColor(colorArr[0]?.trim());
          }

          // Save to Recently Viewed in localStorage
          try {
            const saved = localStorage.getItem('myshop_recently_viewed');
            let list = saved ? JSON.parse(saved) : [];
            list = list.filter((item) => item.id !== p.id);
            list.unshift(p);
            localStorage.setItem('myshop_recently_viewed', JSON.stringify(list.slice(0, 10)));
          } catch (e) {
            console.error('Failed to update recently viewed', e);
          }
        }

        const related = relRes?.data?.data || relRes?.data || [];
        const reviewsList = revRes?.data?.data || revRes?.data || [];
        if (Array.isArray(related)) setRelatedProducts(related);
        if (Array.isArray(reviewsList)) setReviews(reviewsList);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <DetailsSkeleton />;
  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back to Products
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

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

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const success = await addToCart(product, quantity, selectedSize, selectedColor);
    setAddingToCart(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product, quantity, selectedSize, selectedColor);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please sign in to write a product review', 'warning');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) {
      addToast('Please enter your review text', 'warning');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewsApi.add(product.id, {
        rating: newRating,
        comment: newComment.trim(),
      });
      if (res.data) {
        setReviews([res.data, ...reviews]);
        setNewComment('');
        addToast('Review submitted successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container" style={{ padding: '30px 20px 80px' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 28 }}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Products</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.categorySlug || product.category?.slug}`}>
          {product.categoryName || product.category?.name}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Product Hero Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 60 }} className="product-details-grid">
        {/* Gallery */}
        <div>
          <div
            style={{
              aspectRatio: '1 / 1',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border)',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 16,
            }}
          >
            <img
              src={selectedImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={handleImageError}
            />

            {product.isDealRadar && (
              <span className="badge badge-deal" style={{ position: 'absolute', top: 16, left: 16 }}>
                <Flame size={14} /> Deal Radar
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 12 }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: selectedImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: '#fff',
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

        {/* Details & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              {product.brand || product.categoryName}
            </span>

            {/* Smart Score Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              <Award size={16} /> MyShop Smart Score: {product.smartScore || 85}/100
            </div>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1.25, marginBottom: 12 }}>
            {product.name}
          </h1>

          {/* Ratings & Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div className="stars">
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontWeight: 800, color: '#0f172a', marginLeft: 4 }}>
                {product.rating?.toFixed(1) || '4.5'}
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ({product.reviewCount || 0} customer reviews)
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
              {product.stock > 0 ? (product.stock <= 5 ? `🔥 Only ${product.stock} left in stock!` : 'In Stock') : 'Out of Stock'}
            </span>
          </div>

          {/* Price Box */}
          <div
            style={{
              padding: '18px 24px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="badge badge-discount" style={{ fontSize: '0.85rem' }}>
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
            {product.description}
          </p>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>
                Select Color: <span style={{ color: 'var(--primary)' }}>{selectedColor}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.88rem',
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
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>
                Select Size: <span style={{ color: 'var(--primary)' }}>{selectedSize}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.88rem',
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

          {/* Quantity & CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
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
                style={{ padding: '12px 18px', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontWeight: 700, minWidth: 36, textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ padding: '12px 18px', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || addingToCart}
              className={`btn ${justAdded ? 'btn-secondary' : 'btn-primary'} btn-lg`}
              style={{ flex: 1 }}
            >
              {justAdded ? (
                <>
                  <Check size={20} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={20} /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="btn btn-secondary btn-lg"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
              }}
            >
              <Zap size={20} /> Buy Now
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-outline btn-lg"
              style={{ padding: '14px' }}
              title="Save to Wishlist"
            >
              <Heart size={22} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : 'currentColor'} />
            </button>

            <button
              onClick={() => addToCompare(product)}
              className="btn btn-outline btn-lg"
              style={{ padding: '14px' }}
              title="Compare Specifications"
            >
              <Scale size={22} color={inCompare ? 'var(--primary)' : 'currentColor'} />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              padding: '16px 20px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={18} color="var(--primary)" />
              <span>Free Delivery above ₹999</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RotateCcw size={18} color="var(--primary)" />
              <span>7-Day Return Policy</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="#10b981" />
              <span>100% Genuine Guaranteed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={18} color="#f59e0b" />
              <span>Smart Score Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section style={{ margin: '60px 0', borderTop: '1px solid var(--border)', paddingTop: 48 }}>
        <h3 className="heading-md" style={{ marginBottom: 24, color: 'var(--secondary)' }}>
          Customer Reviews & Feedback ({reviews.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40 }} className="reviews-layout">
          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.length === 0 ? (
              <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first to share your experience with this product!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{rev.userFullName}</div>
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.round(rev.rating) ? '#f59e0b' : 'none'}
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Box */}
          <div className="card" style={{ padding: 24, height: 'fit-content' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
              Write a Verified Review
            </h4>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <div style={{ display: 'flex', gap: 8, cursor: 'pointer', margin: '4px 0 12px' }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setNewRating(val)}
                      style={{ padding: 4 }}
                    >
                      <Star
                        size={24}
                        fill={val <= newRating ? '#f59e0b' : 'none'}
                        color="#f59e0b"
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, marginLeft: 8, alignSelf: 'center' }}>
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Review Comment</label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="Share details of your experience with build quality, comfort, performance..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8 }}
              >
                {submittingReview ? 'Submitting...' : 'Post Review'} <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* "You May Also Like" Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ margin: '60px 0', borderTop: '1px solid var(--border)', paddingTop: 48 }}>
          <h3 className="heading-md" style={{ marginBottom: 24, color: 'var(--secondary)' }}>
            You May Also Like
          </h3>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Continue Exploring (Recently Viewed) */}
      <RecentlyViewed currentProductId={product.id} />

      <style>{`
        @media (max-width: 850px) {
          .product-details-grid, .reviews-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
