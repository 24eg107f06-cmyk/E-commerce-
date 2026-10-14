import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { ProductSkeletonGrid } from '../components/LoadingSkeleton';
import RecentlyViewed from '../components/RecentlyViewed';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Star,
  Flame,
  LayoutGrid,
  List,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from query params
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [dealRadarOnly, setDealRadarOnly] = useState(searchParams.get('dealRadar') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');
  const [currentPage, setCurrentPage] = useState(0);

  // Products response state
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View mode and quick view modal
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      const catList = res?.data?.data || res?.data || [];
      if (Array.isArray(catList)) setCategories(catList);
    }).catch(console.error);
  }, []);

  // Sync state with URL params when they change
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearchQuery(searchParams.get('search') || '');
    if (searchParams.get('category') !== null) setSelectedCategory(searchParams.get('category') || '');
    if (searchParams.get('dealRadar') === 'true') setDealRadarOnly(true);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (dealRadarOnly) {
        const res = await productsApi.getDealRadar();
        let list = res?.data?.data || res?.data || [];
        if (Array.isArray(list)) {
          if (selectedCategory) {
            list = list.filter((p) => p.categorySlug === selectedCategory || p.category?.slug === selectedCategory);
          }
          if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter((p) =>
              (p.name && p.name.toLowerCase().includes(q)) ||
              (p.description && p.description.toLowerCase().includes(q)) ||
              (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
              (p.brand && p.brand.toLowerCase().includes(q)) ||
              (p.tags && p.tags.toLowerCase().includes(q))
            );
          }
          setProducts(list);
          setTotalElements(list.length);
          setTotalPages(1);
        }
      } else {
        const selectedCatObj = categories.find((c) => c.slug === selectedCategory);
        const params = {
          categoryId: selectedCatObj ? selectedCatObj.id : undefined,
          search: searchQuery || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          minRating: minRating ? parseFloat(minRating) : undefined,
          inStockOnly: inStockOnly || undefined,
          sortBy: sortBy,
          page: currentPage,
          size: 12,
        };

        const res = await productsApi.getAll(params);
        // Step 3 & Step 7 requirement: read response.data.data.content
        const productList = res?.data?.data?.content || res?.data?.content || (Array.isArray(res?.data) ? res.data : []);
        const pageData = res?.data?.data || res?.data || {};

        setProducts(productList);
        setTotalPages(pageData?.totalPages || (productList.length > 0 ? 1 : 0));
        setTotalElements(pageData?.totalElements || productList.length);
      }
    } catch (err) {
      console.error('Failed to load products', err);
      setError('Unable to load products. Please check the backend.');
    } finally {
      setLoading(false);
    }
  }, [dealRadarOnly, selectedCategory, searchQuery, minPrice, maxPrice, minRating, inStockOnly, sortBy, currentPage, categories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setInStockOnly(false);
    setDealRadarOnly(false);
    setSortBy('featured');
    setCurrentPage(0);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Page Title & Breadcrumb Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="heading-lg" style={{ color: 'var(--secondary)' }}>
          {dealRadarOnly ? '🔥 Deal Radar Exclusives' : selectedCategory ? `${selectedCategory.toUpperCase()} Catalog` : 'Explore All Products'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 4 }}>
          {totalElements} products curated with real-time verified Smart Scores.
        </p>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }} className="catalog-layout">
        {/* =========================================================
            SIDEBAR FILTERS (DESKTOP)
            ========================================================= */}
        <aside className="filters-sidebar">
          <div
            className="card"
            style={{
              padding: 24,
              position: 'sticky',
              top: 96,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem' }}>
                <SlidersHorizontal size={18} /> Filters
              </div>
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.78rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Deal Radar Toggle */}
            <div
              onClick={() => {
                setDealRadarOnly(!dealRadarOnly);
                setCurrentPage(0);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: dealRadarOnly ? '#fee2e2' : 'var(--bg)',
                cursor: 'pointer',
                border: dealRadarOnly ? '1px solid #f87171' : '1px solid var(--border)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.88rem', color: '#dc2626' }}>
                <Flame size={18} /> Deal Radar
              </div>
              <input type="checkbox" checked={dealRadarOnly} onChange={() => {}} style={{ accentColor: '#dc2626' }} />
            </div>

            {/* Categories */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Category
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    color: selectedCategory === '' ? 'var(--primary)' : 'var(--text)',
                    fontWeight: selectedCategory === '' ? 700 : 500,
                  }}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => {
                      setSelectedCategory('');
                      setCurrentPage(0);
                    }}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  All Categories
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      color: selectedCategory === cat.slug ? 'var(--primary)' : 'var(--text)',
                      fontWeight: selectedCategory === cat.slug ? 700 : 500,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => {
                          setSelectedCategory(cat.slug);
                          setCurrentPage(0);
                        }}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      {cat.name}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>({cat.productCount || 0})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Price Range (₹)
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.82rem' }}
                />
                <span style={{ color: 'var(--text-subtle)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="form-control"
                  style={{ padding: '8px 10px', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Customer Rating
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[4.5, 4.0, 3.5].map((rating) => (
                  <label
                    key={rating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === String(rating)}
                      onChange={() => {
                        setMinRating(String(rating));
                        setCurrentPage(0);
                      }}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{rating}★ & above</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* In-Stock Filter */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(0);
                  }}
                  style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                />
                In-Stock Items Only
              </label>
            </div>
          </div>
        </aside>

        {/* =========================================================
            CATALOG BODY
            ========================================================= */}
        <main>
          {/* Top Control Bar: Search input, Sort By dropdown, View Switch */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 24,
              padding: '16px 20px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {/* Live Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <input
                type="text"
                placeholder="Search by product name, tag, or brand..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="form-control"
                style={{ padding: '9px 14px 9px 36px', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.85rem', width: 'auto' }}
              >
                <option value="featured">Featured Picks</option>
                <option value="smart_score">Smart Score (Highest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(selectedCategory || searchQuery || minPrice || maxPrice || minRating || inStockOnly || dealRadarOnly) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {selectedCategory && (
                <span className="badge badge-category" style={{ gap: 6 }}>
                  Category: {selectedCategory}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {searchQuery && (
                <span className="badge badge-category" style={{ gap: 6 }}>
                  Search: "{searchQuery}"
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                </span>
              )}
              {dealRadarOnly && (
                <span className="badge badge-deal" style={{ gap: 6 }}>
                  Deal Radar Active
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setDealRadarOnly(false)} />
                </span>
              )}
              {minRating && (
                <span className="badge badge-category" style={{ gap: 6 }}>
                  Rating: {minRating}★+
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setMinRating('')} />
                </span>
              )}
              {inStockOnly && (
                <span className="badge badge-category" style={{ gap: 6 }}>
                  In Stock Only
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)} />
                </span>
              )}
            </div>
          )}

          {/* Products Grid / Loading / Error / Empty State */}
          {loading ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: '2px solid var(--border)',
                      borderTopColor: 'var(--primary)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  Loading products...
                </span>
              </div>
              <ProductSkeletonGrid count={8} />
            </div>
          ) : error ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                }}
              >
                <AlertTriangle size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>
                Unable to load products. Please check the backend.
              </h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: 440, fontSize: '0.9rem' }}>
                We could not establish a connection to the backend REST API at http://localhost:8080/api/products.
              </p>
              <button onClick={fetchProducts} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
                <RotateCcw size={16} /> Retry Connection
              </button>
            </div>
          ) : products.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <Search size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>
                No Matching Products Found
              </h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: 400, fontSize: '0.9rem' }}>
                We couldn't find any products matching your specific filters or search keywords. Try adjusting your criteria.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 48,
                  }}
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="btn btn-outline btn-sm"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        backgroundColor: currentPage === idx ? 'var(--primary)' : 'var(--surface)',
                        color: currentPage === idx ? 'white' : 'var(--text)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="btn btn-outline btn-sm"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Recently Viewed */}
          <RecentlyViewed onQuickView={setQuickViewProduct} />
        </main>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 900px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
          .filters-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
