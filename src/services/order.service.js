import api from './api';

export const orderService = {
  // Create a new order
  async createOrder(orderData) {
    return api.post('/orders', orderData);
  },
  
  // Get order details by ID
  async getOrderById(orderId) {
    return api.get(`/orders/${orderId}`);
  },
  
  // Get list of orders (for admin or filtered by userId for customers)
  async getOrders(params = {}) {
    return api.get('/orders', { params });
  },
  
  // Update order status
  async updateOrderStatus(orderId, statusData) {
    return api.put(`/orders/${orderId}/status`, statusData);
  }
};
