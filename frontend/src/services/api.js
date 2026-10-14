import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('myshop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;
    if (!error.response || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      message = 'Unable to connect to server. Please make sure the backend is running.';
    } else if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
      message = Object.values(error.response.data.errors).join(', ');
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else {
      message = error.message || 'An unexpected error occurred';
    }
    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};

// Product Services
export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getDealRadar: () => api.get('/products/deal-radar'),
  getFeatured: () => api.get('/products/featured'),
  getTopSmartScore: () => api.get('/products/smart-score-top'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Category Services
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Cart Services
export const cartApi = {
  get: (couponCode, couponDiscountPercent) =>
    api.get('/cart', { params: { couponCode, couponDiscountPercent } }),
  addItem: (item) => api.post('/cart/items', item),
  updateItem: (id, item) => api.put(`/cart/items/${id}`, item),
  removeItem: (id) => api.delete(`/cart/items/${id}`),
  clear: () => api.delete('/cart'),
};

// Wishlist Services
export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/${productId}/move-to-cart`),
};

// Order Services
export const ordersApi = {
  create: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByNumber: (number) => api.get(`/orders/number/${number}`),
};

// User Profile Services
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  addAddress: (data) => api.post('/users/addresses', data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
};

// Coupon Services
export const couponsApi = {
  validate: (code, cartAmount) => api.post('/coupons/validate', { code, cartAmount }),
  getAll: () => api.get('/coupons'),
};

// Review Services
export const reviewsApi = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  add: (productId, data) => api.post(`/reviews/product/${productId}`, data),
};

// Admin Services
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllOrders: (status) => api.get('/admin/orders', { params: { status } }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
};

export default api;
