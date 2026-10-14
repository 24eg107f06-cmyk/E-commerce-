import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('myshop_guest_wishlist');
      return saved ? JSON.parse(saved) : { items: [], totalItems: 0 };
    } catch {
      return { items: [], totalItems: 0 };
    }
  });

  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await wishlistApi.get();
      const w = res.data?.data || res.data;
      if (w) {
        setWishlist(w);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlist.items.some((item) => item.productId === productId || item.id === productId);
  };

  const toggleWishlist = async (product) => {
    const isPresent = isInWishlist(product.id);

    if (isPresent) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const addToWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await wishlistApi.add(product.id);
        const w = res.data?.data || res.data;
        if (w) setWishlist(w);
        addToast(`Added "${product.name}" to wishlist`, 'success');
      } catch (err) {
        addToast(err.message || 'Could not add to wishlist', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      if (!isInWishlist(product.id)) {
        const newItem = {
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          productImageUrl: product.imageUrl,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          stock: product.stock,
          rating: product.rating,
          smartScore: product.smartScore,
          categoryName: product.categoryName || product.category?.name,
          addedAt: new Date().toISOString(),
        };
        const updated = {
          items: [...wishlist.items, newItem],
          totalItems: wishlist.items.length + 1,
        };
        setWishlist(updated);
        localStorage.setItem('myshop_guest_wishlist', JSON.stringify(updated));
        addToast(`Added "${product.name}" to wishlist`, 'success');
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await wishlistApi.remove(productId);
        const w = res.data?.data || res.data;
        if (w) setWishlist(w);
        addToast('Removed from wishlist', 'info');
      } catch (err) {
        addToast(err.message || 'Could not remove from wishlist', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      const filtered = wishlist.items.filter(
        (item) => item.productId !== productId && item.id !== productId
      );
      const updated = { items: filtered, totalItems: filtered.length };
      setWishlist(updated);
      localStorage.setItem('myshop_guest_wishlist', JSON.stringify(updated));
      addToast('Removed from wishlist', 'info');
    }
  };

  const moveToCart = async (product) => {
    const success = await addToCart(product, 1);
    if (success) {
      await removeFromWishlist(product.productId || product.id);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.items.length,
        loading,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
