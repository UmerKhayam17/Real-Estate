'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }, []);

  const checkAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Call logout directly instead of through the function reference
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []); // Removed logout dependency

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const updateUser = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};