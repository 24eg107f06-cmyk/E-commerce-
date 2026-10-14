import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, couponsApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('myshop_guest_cart');
      return saved ? JSON.parse(saved) : { items: [], totalItems: 0, subtotal: 0, discountAmount: 0, deliveryAmount: 0, taxAmount: 0, totalAmount: 0 };
    } catch {
      return { items: [], totalItems: 0, subtotal: 0, discountAmount: 0, deliveryAmount: 0, taxAmount: 0, totalAmount: 0 };
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateTotals = useCallback((items, coupon = appliedCoupon) => {
    let subtotal = 0;
    let totalItems = 0;

    items.forEach((item) => {
      subtotal += (item.price || 0) * (item.quantity || 1);
      totalItems += item.quantity || 1;
    });

    subtotal = Math.round(subtotal * 100) / 100;

    let discountAmount = 0;
    if (coupon && coupon.valid && subtotal > 0) {
      discountAmount = Math.round(subtotal * (coupon.discountPercentage / 100) * 100) / 100;
    }

    const deliveryAmount = subtotal === 0 || subtotal >= 999 ? 0 : 99;
    const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
    const totalAmount = Math.max(0, Math.round((subtotal - discountAmount + deliveryAmount + taxAmount) * 100) / 100);

    return {
      items,
      totalItems,
      subtotal,
      discountAmount,
      deliveryAmount,
      taxAmount,
      totalAmount,
      couponCode: coupon?.code || null,
      couponDiscountPercent: coupon?.discountPercentage || null,
    };
  }, [appliedCoupon]);

  // Load from backend if authenticated
  const fetchBackendCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await cartApi.get(
        appliedCoupon?.code,
        appliedCoupon?.discountPercentage
      );
      const cartData = res.data?.data || res.data;
      if (cartData) {
        setCart(cartData);
      }
    } catch (err) {
      console.error('Failed to fetch backend cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, appliedCoupon]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    }
  }, [isAuthenticated, fetchBackendCart]);

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock', 'error');
      return false;
    }

    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartApi.addItem({
          productId: product.id,
          quantity,
          selectedSize: size,
          selectedColor: color,
        });
        const c = res.data?.data || res.data;
        if (c) setCart(c);
        addToast(`Added "${product.name}" to cart!`, 'success');
        return true;
      } catch (err) {
        addToast(err.message || 'Could not add to cart', 'error');
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Local guest cart
      const currentItems = [...cart.items];
      const existingIndex = currentItems.findIndex(
        (i) => i.productId === product.id && i.selectedSize === size && i.selectedColor === color
      );

      if (existingIndex > -1) {
        const item = currentItems[existingIndex];
        const newQty = item.quantity + quantity;
        if (newQty > product.stock) {
          addToast(`Only ${product.stock} items available in stock`, 'warning');
          return false;
        }
        item.quantity = newQty;
        item.subtotal = item.price * newQty;
      } else {
        currentItems.push({
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          productImageUrl: product.imageUrl,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          quantity,
          selectedSize: size,
          selectedColor: color,
          stock: product.stock,
          subtotal: product.price * quantity,
        });
      }

      const updatedCart = calculateTotals(currentItems);
      setCart(updatedCart);
      localStorage.setItem('myshop_guest_cart', JSON.stringify(updatedCart));
      addToast(`Added "${product.name}" to cart!`, 'success');
      return true;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);

    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartApi.updateItem(itemId, { quantity });
        const c = res.data?.data || res.data;
        if (c) setCart(c);
      } catch (err) {
        addToast(err.message || 'Could not update quantity', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      const currentItems = cart.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity, subtotal: item.price * quantity };
        }
        return item;
      });
      const updatedCart = calculateTotals(currentItems);
      setCart(updatedCart);
      localStorage.setItem('myshop_guest_cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartApi.removeItem(itemId);
        const c = res.data?.data || res.data;
        if (c) setCart(c);
        addToast('Item removed from cart', 'info');
      } catch (err) {
        addToast(err.message || 'Could not remove item', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      const currentItems = cart.items.filter((item) => item.id !== itemId);
      const updatedCart = calculateTotals(currentItems);
      setCart(updatedCart);
      localStorage.setItem('myshop_guest_cart', JSON.stringify(updatedCart));
      addToast('Item removed from cart', 'info');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clear();
        setCart(calculateTotals([]));
      } catch (err) {
        console.error('Error clearing cart', err);
      }
    } else {
      const empty = calculateTotals([]);
      setCart(empty);
      localStorage.removeItem('myshop_guest_cart');
    }
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      addToast('Please enter a coupon code', 'warning');
      return false;
    }
    try {
      const res = await couponsApi.validate(code.trim().toUpperCase(), cart.subtotal);
      const couponRes = res.data?.data || res.data;
      if (couponRes?.valid) {
        setAppliedCoupon(couponRes);
        const updated = calculateTotals(cart.items, couponRes);
        setCart(updated);
        addToast(couponRes.message || 'Coupon applied successfully!', 'success');
        return true;
      } else {
        addToast(couponRes?.message || 'Invalid coupon code', 'error');
        return false;
      }
    } catch (err) {
      addToast(err.message || 'Failed to apply coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    const updated = calculateTotals(cart.items, null);
    setCart(updated);
    addToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.totalItems || 0,
        loading,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        fetchBackendCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
