import api from './api';
import { mockService } from './mock.service';

// Use mockService for development, real API for production
const service = import.meta.env.PROD ? api : mockService;

export const orderService = {
  async createOrder(orderData) {
    return service.post('/orders', orderData);
  },
  
  async getOrderById(orderId) {
    return service.get(`/orders/${orderId}`);
  },
  
  async getOrders(params) {
    return service.get('/orders', { params });
  },
  
  async updateOrderStatus(orderId, status) {
    return service.put(`/orders/${orderId}/status`, { status });
  },
  
  async getDeliveryByOrderId(orderId) {
    return service.get(`/delivery/order/${orderId}`);
  }
};
