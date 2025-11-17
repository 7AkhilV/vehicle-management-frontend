import api from './api';

export const vehicleService = {
  // Get all vehicles
  getAllVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  // Get vehicle by ID
  getVehicleById: async (vehicleId) => {
    const response = await api.get(`/vehicles/${vehicleId}`);
    return response.data;
  },

  // Create vehicle
  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  // Update vehicle
  updateVehicle: async (vehicleId, vehicleData) => {
    const response = await api.put(`/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId) => {
    const response = await api.delete(`/vehicles/${vehicleId}`);
    return response.data;
  },

  // Assign vehicle to user
  assignVehicle: async (vehicleId, userId) => {
    const response = await api.post(`/vehicles/${vehicleId}/assign`, { userId });
    return response.data;
  },

  // Unassign vehicle
  unassignVehicle: async (vehicleId) => {
    const response = await api.post(`/vehicles/${vehicleId}/unassign`);
    return response.data;
  }
};

