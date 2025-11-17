import { cookieManager } from './cookieManager';

// Simple JWT decode without external library
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const tokenManager = {
  // Decode JWT token
  decodeToken: (token) => {
    return decodeJWT(token);
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) return true;
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  // Get current valid token
  getValidToken: () => {
    const token = cookieManager.getToken();
    if (!token) return null;
    
    if (tokenManager.isTokenExpired(token)) {
      cookieManager.clearAll();
      return null;
    }
    
    return token;
  },

  // Extract user info from token
  getUserFromToken: (token) => {
    const decoded = tokenManager.decodeToken(token);
    if (!decoded) return null;
    
    return {
      userId: decoded.userId || decoded.id,
      role: decoded.role,
      email: decoded.email
    };
  }
};

