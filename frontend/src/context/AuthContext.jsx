import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('myshop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('myshop_token'));
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      const authData = res.data?.data || res.data;
      const userData = {
        id: authData.id,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
      };

      setToken(authData.token);
      setUser(userData);
      localStorage.setItem('myshop_token', authData.token);
      localStorage.setItem('myshop_user', JSON.stringify(userData));

      addToast(`Welcome back, ${userData.fullName}!`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const authData = res.data?.data || res.data;
      const newUser = {
        id: authData.id,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
      };

      setToken(authData.token);
      setUser(newUser);
      localStorage.setItem('myshop_token', authData.token);
      localStorage.setItem('myshop_user', JSON.stringify(newUser));

      addToast('Account created successfully!', 'success');
      return { success: true, user: newUser };
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('myshop_token');
    localStorage.removeItem('myshop_user');
    addToast('You have been logged out.', 'info');
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('myshop_user', JSON.stringify(merged));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
