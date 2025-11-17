import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const cookieManager = {
  // Set token in cookie (7 days expiry)
  setToken: (token) => {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 7, 
      secure: true, 
      sameSite: 'strict' 
    });
  },

  // Get token from cookie
  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  // Remove token
  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  // Set user data
  setUser: (user) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { 
      expires: 7, 
      secure: true, 
      sameSite: 'strict' 
    });
  },

  // Get user data
  getUser: () => {
    const user = Cookies.get(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Remove user data
  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  // Clear all auth data
  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  }
};

