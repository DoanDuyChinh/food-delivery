import api from './api';
import { mockService } from './mock.service';

// Use mockService for development, real API for production
const service = import.meta.env.PROD ? api : mockService;

export const deliveryService = {
  async getShipperDeliveries(shipperId, params) {
    return service.get(`/delivery/shipper/${shipperId}`, { params });
  },
  
  async updateDeliveryStatus(deliveryId, status) {
    return service.put(`/delivery/${deliveryId}/status`, { status });
  },
  
  async getShippers(params) {
    return service.get('/shippers', { params });
  },
  
  async createShipper(shipperData) {
    return service.post('/shippers', shipperData);
  }
};
