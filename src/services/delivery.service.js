import api from './api';

export const deliveryService = {
  // Create a new delivery
  async createDelivery(deliveryData) {
    return api.post('/delivery', deliveryData);
  },
  
  // Update delivery status
  async updateDeliveryStatus(deliveryId, statusData) {
    return api.put(`/delivery/${deliveryId}/status`, statusData);
  },
  
  // Get delivery details by order ID
  async getDeliveryByOrderId(orderId) {
    return api.get(`/delivery/order/${orderId}`);
  },
  
  // Get deliveries by shipper ID
  async getDeliveriesByShipperId(shipperId, params = {}) {
    return api.get(`/delivery/shipper/${shipperId}`, { params });
  },

  // async getShippers(params = {}) {
  //   return api.get('/api/shippers', { params });
  // }
};
