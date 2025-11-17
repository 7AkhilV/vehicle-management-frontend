import { createContext, useState, useEffect, useContext } from 'react';
import { cookieManager } from '../utils/cookieManager';
import { tokenManager } from '../utils/tokenManager';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const initAuth = () => {
      const token = tokenManager.getValidToken();
      if (token) {
        const userData = cookieManager.getUser();
        if (userData) {
          setUser(userData);
        } else {
          // Extract user from token if not in cookies
          const tokenUser = tokenManager.getUserFromToken(token);
          if (tokenUser) {
            setUser(tokenUser);
            cookieManager.setUser(tokenUser);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = (token, userData) => {
    cookieManager.setToken(token);
    cookieManager.setUser(userData);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    cookieManager.clearAll();
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!tokenManager.getValidToken();
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

