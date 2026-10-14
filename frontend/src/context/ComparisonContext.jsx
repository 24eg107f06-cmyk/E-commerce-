import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ComparisonContext = createContext(null);

export const ComparisonProvider = ({ children }) => {
  const { addToast } = useToast();

  const [comparedProducts, setComparedProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('myshop_compare_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('myshop_compare_items', JSON.stringify(comparedProducts));
  }, [comparedProducts]);

  const isInCompare = (productId) => {
    return comparedProducts.some((p) => p.id === productId);
  };

  const addToCompare = (product) => {
    if (comparedProducts.length >= 4) {
      addToast('You can compare a maximum of 4 products at once', 'warning');
      return false;
    }
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return false;
    }
    setComparedProducts((prev) => [...prev, product]);
    addToast(`Added "${product.name}" to comparison list`, 'success');
    return true;
  };

  const removeFromCompare = (productId) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('Removed from comparison', 'info');
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparedProducts,
        compareCount: comparedProducts.length,
        isInCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
