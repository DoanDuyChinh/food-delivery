import { createRouter, createWebHistory } from 'vue-router';

// Public pages
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import RestaurantMenu from '../views/RestaurantMenu.vue';

// Protected pages
import Profile from '../views/Profile.vue';
import OrderHistory from '../views/OrderHistory.vue';
import OrderDetails from '../views/OrderDetails.vue';
import DeliveryTracking from '../views/DeliveryTracking.vue';
import Checkout from '../views/Checkout.vue';

// Admin pages
import AdminDashboard from '../views/admin/Dashboard.vue';
import AdminRestaurant from '../views/admin/Restaurant.vue';
import AdminMenu from '../views/admin/Menu.vue';
import AdminOrders from '../views/admin/Orders.vue';
import AdminShippers from '../views/admin/Shippers.vue';

// Shipper pages
import ShipperDashboard from '../views/shipper/Dashboard.vue';
import ShipperDeliveries from '../views/shipper/Deliveries.vue';
import ShipperProfile from '../views/shipper/Profile.vue';

const routes = [
  // Public routes
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/menu', component: RestaurantMenu, name: 'RestaurantMenu' },
  
  // Protected routes (customer)
  { 
    path: '/profile', 
    component: Profile, 
    name: 'Profile',
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/orders', 
    component: OrderHistory, 
    name: 'OrderHistory',
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/orders/:id', 
    component: OrderDetails, 
    name: 'OrderDetails',
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/delivery/:id', 
    component: DeliveryTracking, 
    name: 'DeliveryTracking',
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/checkout', 
    component: Checkout, 
    name: 'Checkout',
    meta: { requiresAuth: true, role: 'customer' }
  },
  
  // Admin routes
  { 
    path: '/admin', 
    component: AdminDashboard, 
    name: 'AdminDashboard',
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/admin/restaurant', 
    component: AdminRestaurant, 
    name: 'AdminRestaurant',
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/admin/menu', 
    component: AdminMenu, 
    name: 'AdminMenu',
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/admin/orders', 
    component: AdminOrders, 
    name: 'AdminOrders',
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/admin/shippers', 
    component: AdminShippers, 
    name: 'AdminShippers',
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/orders/:id',
    name: 'AdminOrderDetails',
    component: () => import('@/views/admin/OrderDetails.vue'),
    props: true,
    meta: { requiresAuth: true, role: 'admin' }
  },
  
  // Shipper routes
  { 
    path: '/shipper', 
    component: ShipperDashboard, 
    name: 'ShipperDashboard',
    meta: { requiresAuth: true, role: 'shipper' }
  },
  { 
    path: '/shipper/deliveries', 
    component: ShipperDeliveries, 
    name: 'ShipperDeliveries',
    meta: { requiresAuth: true, role: 'shipper' }
  },
  { 
    path: '/shipper/profile', 
    component: ShipperProfile, 
    name: 'ShipperProfile',
    meta: { requiresAuth: true, role: 'shipper' }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.role && to.meta.role !== userRole) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
