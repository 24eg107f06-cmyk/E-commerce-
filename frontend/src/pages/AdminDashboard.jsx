import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminApi, productsApi, categoriesApi } from '../services/api';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  LayoutDashboard,
  Boxes,
  Layers,
  ShoppingBag,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'categories', 'orders'
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState(null);

  // Products Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    imageUrl: '',
    additionalImages: '',
    stock: 10,
    tags: '',
    brand: '',
    sizes: '',
    colors: '',
    isDealRadar: false,
    isFeatured: false,
  });

  // Categories Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Package',
    imageUrl: '',
  });

  // Orders Management
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      addToast('Access denied: Admin credentials required', 'error');
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodsRes, catsRes, ordersRes] = await Promise.all([
        adminApi.getDashboard(),
        productsApi.getAll({ size: 100 }),
        categoriesApi.getAll(),
        adminApi.getAllOrders(),
      ]);

      const stats = statsRes?.data?.data || statsRes?.data;
      const prods = prodsRes?.data?.data?.content || prodsRes?.data?.content || prodsRes?.data || [];
      const cats = catsRes?.data?.data || catsRes?.data || [];
      const ords = ordersRes?.data?.data || ordersRes?.data || [];

      if (stats) setStats(stats);
      if (Array.isArray(prods)) setProducts(prods);
      if (Array.isArray(cats)) setCategories(cats);
      if (Array.isArray(ords)) setOrders(ords);
    } catch (err) {
      console.error('Failed to load admin data', err);
      addToast('Failed to load admin records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  // ==========================================
  // PRODUCT HANDLERS
  // ==========================================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: categories[0]?.id || '',
      imageUrl: '',
      additionalImages: '',
      stock: 10,
      tags: '',
      brand: '',
      sizes: '',
      colors: '',
      isDealRadar: false,
      isFeatured: false,
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || '',
      categoryId: p.categoryId || p.category?.id || '',
      imageUrl: p.imageUrl,
      additionalImages: p.additionalImages || '',
      stock: p.stock,
      tags: p.tags || '',
      brand: p.brand || '',
      sizes: p.sizes || '',
      colors: p.colors || '',
      isDealRadar: !!p.isDealRadar,
      isFeatured: !!p.isFeatured,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productFormData,
        price: parseFloat(productFormData.price),
        originalPrice: productFormData.originalPrice ? parseFloat(productFormData.originalPrice) : null,
        categoryId: parseInt(productFormData.categoryId, 10),
        stock: parseInt(productFormData.stock, 10),
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await productsApi.create(payload);
        addToast('Product created successfully!', 'success');
      }

      setShowProductModal(false);
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.delete(id);
      addToast('Product deleted', 'info');
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // ==========================================
  // CATEGORY HANDLERS
  // ==========================================
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesApi.create(categoryFormData);
      addToast('Category created!', 'success');
      setShowCategoryModal(false);
      setCategoryFormData({ name: '', slug: '', description: '', icon: 'Package', imageUrl: '' });
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to create category', 'error');
    }
  };

  // ==========================================
  // ORDER STATUS HANDLERS
  // ==========================================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      addToast(`Order updated to ${newStatus}`, 'success');
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  if (loading || !stats) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Loading Admin Console...</h2>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tags?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders =
    orderStatusFilter === 'ALL'
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Admin Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            <ShieldCheck size={18} /> CONTROL PANEL
          </div>
          <h1 className="heading-lg" style={{ color: 'var(--secondary)', marginTop: 4 }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 6, backgroundColor: 'var(--surface-alt)', padding: 4, borderRadius: 'var(--radius-md)' }}>
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Boxes },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: activeTab === tab.id ? 'var(--surface)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          TAB 1: OVERVIEW ANALYTICS
          ========================================================= */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: '#d1fae5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  {formatPrice(stats.totalRevenue)}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  {stats.totalOrders}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Boxes size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Products</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  {stats.totalProducts}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Registered Users</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  {stats.totalUsers}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Breakdown Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }} className="admin-overview-grid">
            {/* Category Product Distribution */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
                Catalog by Category
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.categoryProductCounts &&
                  Object.entries(stats.categoryProductCounts).map(([catName, count]) => {
                    const pct = Math.round((count / (stats.totalProducts || 1)) * 100);
                    return (
                      <div key={catName}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{catName}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{count} items ({pct}%)</span>
                        </div>
                        <div style={{ height: 8, backgroundColor: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: 999 }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Order Fulfillment Status */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
                Order Fulfillment Status
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats.orderStatusCounts &&
                  Object.entries(stats.orderStatusCounts).map(([statusName, count]) => (
                    <div
                      key={statusName}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: '#f8fafc',
                        borderRadius: 8,
                        fontSize: '0.85rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{statusName}</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: MANAGE PRODUCTS (CRUD)
          ========================================================= */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div style={{ position: 'relative', maxWidth: 360, width: '100%' }}>
              <input
                type="text"
                placeholder="Search products by title..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="form-control"
                style={{ paddingLeft: 36, fontSize: '0.85rem' }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button onClick={handleOpenAddProduct} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Products Table */}
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 18px' }}>Product</th>
                  <th style={{ padding: '14px 18px' }}>Category</th>
                  <th style={{ padding: '14px 18px' }}>Price</th>
                  <th style={{ padding: '14px 18px' }}>Stock</th>
                  <th style={{ padding: '14px 18px' }}>Smart Score</th>
                  <th style={{ padding: '14px 18px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.88rem' }}>
                    <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{p.id}</div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>{p.categoryName || p.category?.name}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontWeight: 700, color: p.stock <= 5 ? '#ea580c' : '#10b981' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="smart-score-pill">★ {p.smartScore || 85}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          style={{ padding: 6, borderRadius: 6, backgroundColor: '#eff6ff', color: 'var(--primary)' }}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ padding: 6, borderRadius: 6, backgroundColor: '#fee2e2', color: 'var(--deal)' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: MANAGE CATEGORIES
          ========================================================= */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button onClick={() => setShowCategoryModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Category
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {categories.map((c) => (
              <div key={c.id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                <img src={c.imageUrl} alt={c.name} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--secondary)' }}>{c.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Slug: {c.slug}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>
                    {c.productCount || 0} active products
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: MANAGE ORDERS
          ========================================================= */}
      {activeTab === 'orders' && (
        <div>
          {/* Status Filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: orderStatusFilter === st ? 'var(--primary)' : 'var(--surface)',
                  color: orderStatusFilter === st ? 'white' : 'var(--text)',
                  border: '1px solid var(--border)',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '14px 18px' }}>Order Number</th>
                  <th style={{ padding: '14px 18px' }}>Customer</th>
                  <th style={{ padding: '14px 18px' }}>Total</th>
                  <th style={{ padding: '14px 18px' }}>Payment</th>
                  <th style={{ padding: '14px 18px' }}>Current Status</th>
                  <th style={{ padding: '14px 18px' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.88rem' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary)' }}>
                      #{ord.orderNumber}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600 }}>{ord.shippingFullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.shippingCity}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 800 }}>
                      {formatPrice(ord.finalAmount)}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ord.paymentMethod}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          backgroundColor: ord.status === 'DELIVERED' ? '#d1fae5' : '#eff6ff',
                          color: ord.status === 'DELIVERED' ? '#065f46' : 'var(--primary)',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '0.82rem', width: 'auto' }}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          PRODUCT ADD/EDIT MODAL
          ========================================================= */}
      {showProductModal && (
        <div className="modal-backdrop" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 32, maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} style={{ color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={productFormData.categoryId}
                    onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Main Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={productFormData.imageUrl}
                  onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Additional Images (comma-separated URLs)</label>
                <input
                  type="text"
                  className="form-control"
                  value={productFormData.additionalImages}
                  onChange={(e) => setProductFormData({ ...productFormData, additionalImages: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Sizes (comma-separated, e.g. S,M,L)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productFormData.sizes}
                    onChange={(e) => setProductFormData({ ...productFormData, sizes: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Colors (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productFormData.colors}
                    onChange={(e) => setProductFormData({ ...productFormData, colors: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, margin: '12px 0 24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isDealRadar}
                    onChange={(e) => setProductFormData({ ...productFormData, isDealRadar: e.target.checked })}
                  />
                  Deal Radar Highlight
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isFeatured}
                    onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                  />
                  Featured Home Pick
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          CATEGORY ADD MODAL
          ========================================================= */}
      {showCategoryModal && (
        <div className="modal-backdrop" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 32, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Add New Category</h3>
              <button onClick={() => setShowCategoryModal(false)} style={{ color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug (Optional, e.g. electronics)</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryFormData.slug}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={categoryFormData.imageUrl}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 800px) {
          .admin-overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
