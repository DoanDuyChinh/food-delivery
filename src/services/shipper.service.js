import api from './api';

export const shipperService = {
  // Create a new shipper (admin only)
  async createShipper(shipperData) {
    return api.post('/shippers', shipperData);
  },
  
  // Get shipper details by ID
  async getShipperById(userId) {
    return api.get(`/shippers/${userId}`);
  },
  
  // Get list of shippers (admin only)
  async getShippers(params = {}) {
    return api.get('/shippers', { params });
  }
};
