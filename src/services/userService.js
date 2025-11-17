import api from './api';

export const userService = {
  // Get all users (Admin)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Create user (Admin)
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user (Admin)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (Admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Get my profile
  getMyProfile: async () => {
    const response = await api.get('/my/profile');
    return response.data;
  },

  // Get user's vehicles (Admin)
  getUserVehicles: async (userId) => {
    const response = await api.get(`/users/${userId}/vehicles`);
    return response.data;
  },

  // Get my vehicles
  getMyVehicles: async () => {
    const response = await api.get('/my/vehicles');
    return response.data;
  }
};

