import api from './api';

export const deliveryService = {
  // Create new delivery
  async createDelivery(deliveryData) {
    return api.post('/delivery', deliveryData);
  },
  
  // Update delivery status
  async updateDeliveryStatus(deliveryId, status) {
    return api.put(`/delivery/${deliveryId}/status`, { status });
  },
  
  // Get deliveries by shipper id
  async getDeliveriesByShipper(shipperId, params = {}) {
    try {
      const response = await api.get(`/delivery/shipper/${shipperId}`, { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      return [];
    }
  },
  
  // Get delivery by order id
  async getDeliveryByOrder(orderId) {
    try {
      const response = await api.get(`/delivery/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery by order:', error);
      return null;
    }
  },
  
  // Get shipper list (for admin)
  async getShippers() {
    try {
      const response = await api.get('/shippers');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching shippers:', error);
      return [];
    }
  },
  
  // Get delivery by id
  async getDeliveryById(orderId) {
    try {
      const response = await api.get(`/delivery/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery:', error);
      throw error;
    }
  }
};
