// Mock data based on API.md sample responses
const mockData = {
  users: [
    {
      userId: '1',
      email: 'duong@example.com',
      password: 'supersecurepassword', // In real app, password would never be stored like this
      name: 'Thai Duong',
      gender: 'gay',
      phone: '1234567890',
      role: 'customer'
    },
    {
      userId: '2',
      email: 'admin@example.com',
      password: 'adminpassword',
      name: 'Admin User',
      gender: 'non-binary',
      phone: '0987654321',
      role: 'admin'
    },
    {
      userId: '3',
      email: 'shipper@example.com',
      password: 'shipperpassword',
      name: 'Shipper User',
      gender: 'male',
      phone: '5555555555',
      role: 'shipper',
      vehicleType: 'car',
      vehiclePlate: '30K-999.99',
      totalDeliveries: 42,
      status: 'available'
    }
  ],
  restaurant: {
    name: 'Coastal Breeze Bistro',
    description: 'A charming seaside restaurant offering fresh seafood and Mediterranean-inspired dishes in a relaxed atmosphere with ocean views.',
    address: 'Chung cư Season Avenue',
    phoneNumber: '+1-415-555-8723',
    isActive: true,
    openTime: '0000-01-01T11:00:00Z',
    closeTime: '0000-01-01T23:00:00Z'
  },
  menu: [
    {
      id: 1,
      name: 'Pan-Seared Salmon',
      description: 'Fresh Atlantic salmon seared to perfection, served with roasted vegetables and lemon-dill sauce.',
      price: 24000,
      isAvailable: true,
      image: 'https://static01.nyt.com/images/2024/02/13/multimedia/LH-pan-seared-salmon-lwzt/LH-pan-seared-salmon-lwzt-mediumSquareAt3X.jpg'
    },
    {
      id: 2,
      name: 'Mediterranean Pasta',
      description: 'Al dente pasta with sun-dried tomatoes, olives, feta cheese, and fresh herbs in a light olive oil sauce.',
      price: 27000,
      isAvailable: true,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrNGbsLrQaN7TyYv93p2gGhyDKcd9MzqshkA&s'
    },
    {
      id: 3,
      name: 'Grilled Seafood Platter',
      description: 'An assortment of grilled shrimp, scallops, and fish fillets, served with a citrus butter sauce and seasonal vegetables.',
      price: 32000,
      isAvailable: true,
      image: 'https://eastsidebarandgrill.com.au/wp-content/uploads/2022/03/Eastside_Seafood-Platter_1200x800px.jpg'
    },
    {
      id: 4,
      name: 'Lemon Herb Chicken',
      description: 'Tender chicken breast marinated in lemon and herbs, grilled to perfection and served with roasted potatoes.',
      price: 22000,
      isAvailable: true,
      image: 'https://www.foodandwine.com/thmb/t9YqzGbmH-huAbV6xitCQs0-G4s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/FAW-recipes-herb-and-lemon-roasted-chicken-hero-c4ba0aec56884683be482c47b1e1df11.jpg'
    },
    {
      id: 5,
      name: 'Vegetarian Risotto',
      description: 'Creamy arborio rice cooked with wild mushrooms, asparagus, and parmesan cheese.',
      price: 20000,
      isAvailable: true,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6dgoSlQmnXyuVWdQUZU3ERZAgbXmXGtlU6g&s'
    }
  ],
  orders: [
    {
      id: 1,
      userId: '1',
      shippingAddress: '22 Ao Sen, Mộ Lao, Hà Đông, Hà Nội',
      phoneNumber: '1234567890',
      status: 'delivered',
      subtotal: 83000,
      deliveryFee: 7054,
      totalAmount: 90054,
      orderItems: [
        {
          menuItemId: 1,
          quantity: 2,
          unitPrice: 24000,
          totalPrice: 48000
        },
        {
          menuItemId: 4,
          quantity: 1,
          unitPrice: 22000,
          totalPrice: 22000
        },
        {
          menuItemId: 5,
          quantity: 1,
          unitPrice: 20000,
          totalPrice: 20000
        }
      ],
      delivery: {
        distance: 1.410828,
        duration: 4.85605,
        fee: 7054,
        fromCoords: [105.786744, 20.986808],
        toCoords: [105.78992, 20.981995],
        geometryLine: "q~a_CcntdSeAzD{AtEzHrKbA_A?}B\\gEvBwIxBwEtDmE|G}G",
        status: "delivered",
        shipper: {
          name: "Thai Duong",
          gender: "gay",
          phone: "1234567890",
          vehicleType: "car",
          vehiclePlate: "30K-999.99"
        }
      }
    },
    {
      id: 2,
      userId: '1',
      shippingAddress: '22 Ao Sen, Mộ Lao, Hà Đông, Hà Nội',
      phoneNumber: '1234567890',
      status: 'delivering',
      subtotal: 59000,
      deliveryFee: 7054,
      totalAmount: 66054,
      orderItems: [
        {
          menuItemId: 2,
          quantity: 1,
          unitPrice: 27000,
          totalPrice: 27000
        },
        {
          menuItemId: 3,
          quantity: 1,
          unitPrice: 32000,
          totalPrice: 32000
        }
      ],
      delivery: {
        distance: 1.410828,
        duration: 4.85605,
        fee: 7054,
        fromCoords: [105.786744, 20.986808],
        toCoords: [105.78992, 20.981995],
        geometryLine: "q~a_CcntdSeAzD{AtEzHrKbA_A?}B\\gEvBwIxBwEtDmE|G}G",
        status: "delivering",
        shipper: {
          name: "Thai Duong",
          gender: "gay",
          phone: "1234567890",
          vehicleType: "car",
          vehiclePlate: "30K-999.99"
        }
      }
    }
  ],
  shippers: [
    {
      userId: '3',
      email: 'shipper@example.com',
      name: 'Shipper User',
      gender: 'male',
      phone: '5555555555',
      role: 'shipper',
      vehicleType: 'car',
      vehiclePlate: '30K-999.99',
      totalDeliveries: 42,
      status: 'available'
    },
    {
      userId: '4',
      email: 'shipper2@example.com',
      name: 'Another Shipper',
      gender: 'female',
      phone: '5556667777',
      role: 'shipper',
      vehicleType: 'motorcycle',
      vehiclePlate: '29X-888.88',
      totalDeliveries: 27,
      status: 'busy'
    }
  ],
  deliveries: [
    {
      deliveryId: 1,
      orderId: 1,
      distance: 1.410828,
      duration: 4.85605,
      fee: 7054,
      fromCoords: [105.786744, 20.986808],
      toCoords: [105.78992, 20.981995],
      geometryLine: "q~a_CcntdSeAzD{AtEzHrKbA_A?}B\\gEvBwIxBwEtDmE|G}G",
      status: "delivered",
      shipper: {
        userId: '3',
        name: "Thai Duong",
        gender: "gay",
        phone: "1234567890",
        vehicleType: "car",
        vehiclePlate: "30K-999.99"
      }
    },
    {
      deliveryId: 2,
      orderId: 2,
      distance: 1.410828,
      duration: 4.85605,
      fee: 7054,
      fromCoords: [105.786744, 20.986808],
      toCoords: [105.78992, 20.981995],
      geometryLine: "q~a_CcntdSeAzD{AtEzHrKbA_A?}B\\gEvBwIxBwEtDmE|G}G",
      status: "delivering",
      shipper: {
        userId: '3',
        name: "Thai Duong",
        gender: "gay",
        phone: "1234567890",
        vehicleType: "car",
        vehiclePlate: "30K-999.99"
      }
    }
  ]
};

// Helper function to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Safe localStorage getter
const getFromStorage = (key) => {
  if (isBrowser) {
    return localStorage.getItem(key);
  }
  return null;
};

// Safe localStorage setter
const setToStorage = (key, value) => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

// Mock service for development
export const mockService = {
  async get(endpoint) {
    await delay();
    
    if (endpoint === '/auth/login') {
      throw new Error('Method not allowed');
    }
    
    if (endpoint === '/restaurant') {
      return mockData.restaurant;
    }
    
    if (endpoint === '/restaurant/menu') {
      return mockData.menu;
    }
    
    if (endpoint.startsWith('/orders/')) {
      const orderId = parseInt(endpoint.split('/').pop());
      const order = mockData.orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');
      return order;
    }
    
    if (endpoint === '/orders') {
      return mockData.orders;
    }
    
    if (endpoint === '/shippers') {
      return mockData.shippers;
    }
    
    if (endpoint === '/users/profile') {
      const userId = getFromStorage('userId');
      const user = mockData.users.find(u => u.userId === userId);
      if (!user) throw new Error('User not found');
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    throw new Error(`Endpoint not mocked: ${endpoint}`);
  },
  
  async post(endpoint, data) {
    await delay();
    
    if (endpoint === '/auth/login') {
      const { email, password } = data;
      const user = mockData.users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      
      setToStorage('userId', user.userId);
      
      return {
        userId: user.userId,
        accessToken: 'mock-token-' + Date.now(),
        role: user.role
      };
    }
    
    if (endpoint === '/auth/register') {
      const newUser = {
        userId: String(mockData.users.length + 1),
        ...data
      };
      mockData.users.push(newUser);
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    }
    
    if (endpoint === '/orders') {
      const newOrder = {
        id: mockData.orders.length + 1,
        userId: getFromStorage('userId') || '1',
        ...data,
        status: 'created',
        subtotal: data.orderItems.reduce((sum, item) => {
          const menuItem = mockData.menu.find(m => m.id === item.menuItemId);
          return sum + (menuItem.price * item.quantity);
        }, 0),
        deliveryFee: 7054,
      };
      
      newOrder.totalAmount = newOrder.subtotal + newOrder.deliveryFee;
      
      // Calculate each item's price info
      newOrder.orderItems = newOrder.orderItems.map(item => {
        const menuItem = mockData.menu.find(m => m.id === item.menuItemId);
        return {
          ...item,
          unitPrice: menuItem.price,
          totalPrice: menuItem.price * item.quantity
        };
      });
      
      // Create delivery
      const delivery = {
        distance: 1.410828,
        duration: 4.85605,
        fee: 7054,
        fromCoords: [105.786744, 20.986808],
        toCoords: [105.78992, 20.981995],
        geometryLine: "q~a_CcntdSeAzD{AtEzHrKbA_A?}B\\gEvBwIxBwEtDmE|G}G",
        status: "assigned",
        shipper: {
          name: "Thai Duong",
          gender: "gay",
          phone: "1234567890",
          vehicleType: "car",
          vehiclePlate: "30K-999.99"
        }
      };
      
      newOrder.delivery = delivery;
      mockData.orders.push(newOrder);
      
      return newOrder;
    }
    
    throw new Error(`Endpoint not mocked: ${endpoint}`);
  },
  
  async patch(endpoint, data) {
    await delay();
    
    if (endpoint === '/users/profile') {
      const userId = getFromStorage('userId');
      const userIndex = mockData.users.findIndex(u => u.userId === userId);
      if (userIndex === -1) throw new Error('User not found');
      
      mockData.users[userIndex] = {
        ...mockData.users[userIndex],
        ...data
      };
      
      const { password, ...userWithoutPassword } = mockData.users[userIndex];
      return userWithoutPassword;
    }
    
    if (endpoint === '/restaurant') {
      mockData.restaurant = {
        ...mockData.restaurant,
        ...data
      };
      return mockData.restaurant;
    }
    
    if (endpoint.startsWith('/restaurant/menu/item/')) {
      const itemId = parseInt(endpoint.split('/').pop());
      const itemIndex = mockData.menu.findIndex(i => i.id === itemId);
      if (itemIndex === -1) throw new Error('Menu item not found');
      
      mockData.menu[itemIndex] = {
        ...mockData.menu[itemIndex],
        ...data
      };
      
      return mockData.menu[itemIndex];
    }
    
    throw new Error(`Endpoint not mocked: ${endpoint}`);
  },
  
  async put(endpoint, data) {
    await delay();
    
    if (endpoint === '/users/password') {
      const userId = getFromStorage('userId');
      const userIndex = mockData.users.findIndex(u => u.userId === userId);
      if (userIndex === -1) throw new Error('User not found');
      
      const { currentPassword, newPassword } = data;
      if (mockData.users[userIndex].password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      mockData.users[userIndex].password = newPassword;
      return { message: 'password changed successfully' };
    }
    
    if (endpoint.startsWith('/orders/') && endpoint.endsWith('/status')) {
      const orderId = parseInt(endpoint.split('/')[2]);
      const orderIndex = mockData.orders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) throw new Error('Order not found');
      
      mockData.orders[orderIndex].status = data.status;
      
      // Update delivery status too if necessary
      if (mockData.orders[orderIndex].delivery) {
        if (data.status === 'cancelled') {
          mockData.orders[orderIndex].delivery.status = 'cancelled';
        }
      }
      
      return { message: 'status updated successfully' };
    }
    
    if (endpoint.startsWith('/delivery/') && endpoint.endsWith('/status')) {
      const deliveryId = parseInt(endpoint.split('/')[2]);
      const deliveryIndex = mockData.deliveries.findIndex(d => d.deliveryId === deliveryId);
      if (deliveryIndex === -1) throw new Error('Delivery not found');
      
      mockData.deliveries[deliveryIndex].status = data.status;
      
      // Find associated order and update its status too
      const orderId = mockData.deliveries[deliveryIndex].orderId;
      const orderIndex = mockData.orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        if (data.status === 'delivering') {
          mockData.orders[orderIndex].status = 'delivering';
        } else if (data.status === 'delivered') {
          mockData.orders[orderIndex].status = 'delivered';
        } else if (data.status === 'cancelled') {
          mockData.orders[orderIndex].status = 'cancelled';
        }
      }
      
      return { message: 'Delivery status updated successfully' };
    }
    
    throw new Error(`Endpoint not mocked: ${endpoint}`);
  },
  
  async delete(endpoint) {
    await delay();
    
    if (endpoint.startsWith('/restaurant/menu/item/')) {
      const itemId = parseInt(endpoint.split('/').pop());
      const itemIndex = mockData.menu.findIndex(i => i.id === itemId);
      if (itemIndex === -1) throw new Error('Menu item not found');
      
      mockData.menu.splice(itemIndex, 1);
      return { message: 'Menu item deleted successfully' };
    }
    
    throw new Error(`Endpoint not mocked: ${endpoint}`);
  }
};
