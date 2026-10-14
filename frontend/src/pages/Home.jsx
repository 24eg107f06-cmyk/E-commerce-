import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import DealRadarSection from '../components/DealRadarSection';
import RecentlyViewed from '../components/RecentlyViewed';
import RecommendedForYou from '../components/RecommendedForYou';
import { ProductSkeletonGrid } from '../components/LoadingSkeleton';
import {
  ArrowRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, featRes, dealsRes] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getFeatured(),
          productsApi.getDealRadar(),
        ]);

        const cats = catsRes?.data?.data || catsRes?.data || [];
        const feat = featRes?.data?.data?.content || featRes?.data?.data || featRes?.data || [];
        const deals = dealsRes?.data?.data?.content || dealsRes?.data?.data || dealsRes?.data || [];

        if (Array.isArray(cats)) setCategories(cats);
        if (Array.isArray(feat)) setFeaturedProducts(feat);
        if (Array.isArray(deals)) setDealProducts(deals);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div>
      {/* =========================================================
          1. HERO SECTION
          ========================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 90px',
          background: 'radial-gradient(circle at 80% 20%, #e0e7ff 0%, #f8fafc 60%)',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 48, alignItems: 'center' }}>
          {/* Left Text */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: 20,
              }}
            >
              <Sparkles size={16} /> NEXT-GEN SHOPPING EXPERIENCE
            </div>

            <h1 className="heading-xl" style={{ color: 'var(--secondary)', marginBottom: 20 }}>
              SHOP THE WAY <br />
              <span className="text-gradient">YOU WANT</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: 520,
                marginBottom: 36,
              }}
            >
              Discover products you'll love, curated for your everyday lifestyle with intelligent Smart Scores and real-time Deal Radar.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?dealRadar=true"
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'var(--deal)', color: 'var(--deal)', backgroundColor: '#ffffff' }}
              >
                <Flame size={18} /> View Offers
              </Link>
            </div>

            {/* Micro Stats */}
            <div
              style={{
                display: 'flex',
                gap: 32,
                marginTop: 48,
                paddingTop: 28,
                borderTop: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>25+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Curated Collections</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>94/100</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg. Smart Score</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authentic Gear</div>
              </div>
            </div>
          </div>

          {/* Right Visual Image Showcase */}
          <div style={{ position: 'relative' }} className="hero-visual-wrap">
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                alt="MYSHOP Featured Product"
                style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1.02)' }}
              />

              {/* Floating Pill: Smart Score */}
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  left: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '10px 16px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                  }}
                >
                  98
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>SMART SCORE</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Top Quality Pick</div>
                </div>
              </div>

              {/* Floating Pill: Deal Radar */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  right: 24,
                  backgroundColor: 'rgba(15, 23, 42, 0.92)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontWeight: 700, fontSize: '0.8rem' }}>
                  <Flame size={16} /> DEAL RADAR DETECTED
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 2 }}>
                  44% OFF Active Now
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-visual-wrap {
              display: none;
            }
          }
        `}</style>
      </section>

      {/* =========================================================
          2. CATEGORIES SECTION
          ========================================================= */}
      <section className="page-section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Curated Collections
              </span>
              <h2 className="heading-lg" style={{ color: 'var(--secondary)', marginTop: 4 }}>
                Explore by Category
              </h2>
            </div>
            <Link
              to="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.92rem',
              }}
            >
              All Categories <ChevronRight size={18} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 16,
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/products?category=${cat.slug}`)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px 14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>{cat.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {cat.productCount || 0} Products
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          3. DEAL RADAR SECTION
          ========================================================= */}
      <DealRadarSection deals={dealProducts} onQuickView={setQuickViewProduct} />

      {/* =========================================================
          4. SMART SCORE EXPLAINER BANNER
          ========================================================= */}
      <section className="container" style={{ margin: '40px auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            borderRadius: '24px',
            padding: '40px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 32,
            alignItems: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}
          className="smart-score-banner"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem' }}>
              <Award size={18} /> PROPRIETARY ALGORITHM
            </div>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '10px 0 14px', lineHeight: 1.25 }}>
              Meet the MyShop Smart Score™
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
              Never guess product quality again. Our real-time algorithm mathematically computes a single 0-100 score balancing 4 dimensions: Customer Ratings (40%), Review Volume (20%), Discount Value (20%), and Inventory Health (20%).
            </p>
            <Link to="/products?sortBy=smart_score" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
              Explore High Smart-Score Products <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span>Customer Rating Weight</span>
                <span style={{ color: '#60a5fa', fontWeight: 700 }}>40%</span>
              </div>
              <div style={{ height: 6, background: '#334155', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: '#3b82f6' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span>Verified Review Volume</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>20%</span>
              </div>
              <div style={{ height: 6, background: '#334155', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: '#10b981' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span>Price-to-Discount Value</span>
                <span style={{ color: '#f87171', fontWeight: 700 }}>20%</span>
              </div>
              <div style={{ height: 6, background: '#334155', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: '#ef4444' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                <span>Stock Reliability & Demand</span>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>20%</span>
              </div>
              <div style={{ height: 6, background: '#334155', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: '#f59e0b' }} />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 800px) {
            .smart-score-banner {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* =========================================================
          5. FEATURED PRODUCTS SECTION
          ========================================================= */}
      <section className="page-section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Trending Now
              </span>
              <h2 className="heading-lg" style={{ color: 'var(--secondary)', marginTop: 4 }}>
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.92rem',
              }}
            >
              Browse Full Catalog <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <ProductSkeletonGrid count={8} />
          ) : (
            <div className="product-grid">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          6. SMART RECOMMENDATIONS ("PICKED FOR YOU")
          ========================================================= */}
      <div className="container">
        <RecommendedForYou onQuickView={setQuickViewProduct} />
      </div>

      {/* =========================================================
          7. RECENTLY VIEWED ("CONTINUE EXPLORING")
          ========================================================= */}
      <div className="container">
        <RecentlyViewed onQuickView={setQuickViewProduct} />
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
