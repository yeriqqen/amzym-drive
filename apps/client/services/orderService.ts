import { Order, DeliveryTracking, OrderItem } from '../types/order';

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Fresh tomato sauce, mozzarella, and basil',
        price: 32000,
        category: 'Pizza',
        image: '/images/pizza.jpg',
        quantity: 1,
      },
      {
        id: 2,
        name: 'Caesar Salad',
        description: 'Crispy romaine lettuce with caesar dressing',
        price: 12000,
        category: 'Salad',
        image: '/images/salad.jpg',
        quantity: 1,
      },
    ],
    totalAmount: 44000,
    status: 'CONFIRMED',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:35:00'),
  },
  {
    id: 2,
    userId: 1,
    items: [
      {
        id: 3,
        name: 'Chicken Burger',
        description: 'Grilled chicken breast with lettuce and tomato',
        price: 9000,
        category: 'Burger',
        image: '/images/burger.jpg',
        quantity: 1,
      },
    ],
    totalAmount: 9000,
    status: 'PREPARING',
    createdAt: new Date('2024-01-15T11:00:00'),
    updatedAt: new Date('2024-01-15T11:05:00'),
  },
  {
    id: 3,
    userId: 1,
    items: [
      {
        id: 4,
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs, cheese, and pancetta',
        price: 22000,
        category: 'Pasta',
        image: '/images/pasta.jpg',
        quantity: 1,
      },
    ],
    totalAmount: 22000,
    status: 'OUT_FOR_DELIVERY',
    createdAt: new Date('2024-01-15T09:15:00'),
    updatedAt: new Date('2024-01-15T11:45:00'),
  },
  {
    id: 4,
    userId: 1,
    items: [
      {
        id: 5,
        name: 'Fish and Chips',
        description: 'Beer-battered fish with crispy fries',
        price: 16000,
        category: 'Seafood',
        image: '/images/fish.jpg',
        quantity: 1,
      },
    ],
    totalAmount: 16000,
    status: 'DELIVERED',
    createdAt: new Date('2024-01-14T18:30:00'),
    updatedAt: new Date('2024-01-14T19:15:00'),
  },
];

const mockDeliveryTracking: Record<number, DeliveryTracking> = {
  1: {
    orderId: 1,
    status: 'CONFIRMED',
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    currentLocation: {
      lat: 35.228950619029085,
      lng: 126.8427269951037,
    },
    destination: {
      lat: 35.22858702880908,
      lng: 126.83922370972543,
    },
    managerInfo: {
      name: 'Sarah Johnson',
      phone: '+82-10-1234-5678',
      department: 'Kitchen Operations',
      role: 'Kitchen Manager',
    },
    updates: [
      {
        timestamp: new Date('2024-01-15T10:30:00'),
        status: 'Order received',
        location: 'Restaurant Kitchen',
      },
      {
        timestamp: new Date('2024-01-15T10:35:00'),
        status: 'Order confirmed',
        location: 'Restaurant Kitchen',
      },
    ],
  },
  2: {
    orderId: 2,
    status: 'PREPARING',
    estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000), // 35 minutes from now
    currentLocation: {
      lat: 35.228950619029085,
      lng: 126.8427269951037,
    },
    destination: {
      lat: 35.22858702880908,
      lng: 126.83922370972543,
    },
    managerInfo: {
      name: 'Mike Chen',
      phone: '+82-10-2345-6789',
      department: 'Food Preparation',
      role: 'Head Chef',
    },
    updates: [
      {
        timestamp: new Date('2024-01-15T11:00:00'),
        status: 'Order received',
        location: 'Restaurant Kitchen',
      },
      {
        timestamp: new Date('2024-01-15T11:05:00'),
        status: 'Preparing your order',
        location: 'Restaurant Kitchen',
      },
    ],
  },
  3: {
    orderId: 3,
    status: 'OUT_FOR_DELIVERY',
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    currentLocation: {
      lat: 35.229,
      lng: 126.842,
    },
    destination: {
      lat: 35.22858702880908,
      lng: 126.83922370972543,
    },
    managerInfo: {
      name: 'Emma Davis',
      phone: '+82-10-3456-7890',
      department: 'Delivery Operations',
      role: 'Delivery Manager',
    },
    updates: [
      {
        timestamp: new Date('2024-01-15T09:15:00'),
        status: 'Order received',
        location: 'Restaurant Kitchen',
      },
      {
        timestamp: new Date('2024-01-15T09:30:00'),
        status: 'Order prepared',
        location: 'Restaurant Kitchen',
      },
      {
        timestamp: new Date('2024-01-15T11:45:00'),
        status: 'Out for delivery',
        location: 'En route to customer',
      },
    ],
  },
  4: {
    orderId: 4,
    status: 'DELIVERED',
    estimatedDeliveryTime: new Date('2024-01-14T19:15:00'),
    currentLocation: {
      lat: 35.22858702880908,
      lng: 126.83922370972543,
    },
    destination: {
      lat: 35.22858702880908,
      lng: 126.83922370972543,
    },
    managerInfo: {
      name: 'James Wilson',
      phone: '+82-10-4567-8901',
      department: 'Customer Service',
      role: 'Service Manager',
    },
    updates: [
      {
        timestamp: new Date('2024-01-14T18:30:00'),
        status: 'Order received',
        location: 'Restaurant Kitchen',
      },
      {
        timestamp: new Date('2024-01-14T18:45:00'),
        status: 'Order prepared',
        location: 'Restaurant Kitchen',
      },
      {
        timestamp: new Date('2024-01-14T19:00:00'),
        status: 'Out for delivery',
        location: 'En route to customer',
      },
      {
        timestamp: new Date('2024-01-14T19:15:00'),
        status: 'Delivered successfully',
        location: 'Customer location',
      },
    ],
  },
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to ensure order has proper structure
const normalizeOrder = (order: any): Order => {
  return {
    id: order.id || 0,
    userId: order.userId || 0,
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          id: item.id || 0,
          name: item.name || 'Unknown Item',
          description: item.description || '',
          price: typeof item.price === 'number' ? item.price : 0,
          category: item.category || 'Unknown',
          image: item.image || '',
          quantity: typeof item.quantity === 'number' ? item.quantity : 1,
        }))
      : [],
    totalAmount: typeof order.totalAmount === 'number' ? order.totalAmount : 0,
    status: order.status || 'pending',
    createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
    updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const orderService = {
  // Get all orders for a user
  async getOrders(userId?: number): Promise<Order[]> {
    await delay(500); // Simulate API call delay

    try {
      let filteredOrders = mockOrders;

      if (userId) {
        filteredOrders = mockOrders.filter((order) => order.userId === userId);
      }

      // Normalize all orders to ensure proper structure
      return filteredOrders.map(normalizeOrder);
    } catch (error) {
      console.error('Error in getOrders:', error);
      return [];
    }
  },

  // Get a specific order by ID
  async getOrder(orderId: number): Promise<Order | null> {
    await delay(300);

    try {
      const order = mockOrders.find((order) => order.id === orderId);
      return order ? normalizeOrder(order) : null;
    } catch (error) {
      console.error('Error in getOrder:', error);
      return null;
    }
  },

  // Get delivery tracking information for an order
  async getDeliveryTracking(orderId: number): Promise<DeliveryTracking | null> {
    await delay(400);

    try {
      const tracking = mockDeliveryTracking[orderId];
      return tracking || null;
    } catch (error) {
      console.error('Error in getDeliveryTracking:', error);
      return null;
    }
  },

  // Create a new order
  async createOrder(orderData: any, token?: string) {
    // orderData: { items, totalAmount, ... }
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: number, status: string): Promise<Order | null> {
    await delay(300);

    try {
      const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
      if (orderIndex === -1) return null;

      mockOrders[orderIndex].status = status;
      mockOrders[orderIndex].updatedAt = new Date();

      // Update delivery tracking
      if (mockDeliveryTracking[orderId]) {
        mockDeliveryTracking[orderId].status = status;
        mockDeliveryTracking[orderId].updates.push({
          timestamp: new Date(),
          status: `Status updated to ${status}`,
          location: status === 'delivered' ? 'Customer location' : 'In progress',
        });
      }

      return normalizeOrder(mockOrders[orderIndex]);
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      return null;
    }
  },

  // Cancel an order
  async cancelOrder(orderId: number): Promise<boolean> {
    await delay(400);

    try {
      const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
      if (orderIndex === -1) return false;

      if (mockOrders[orderIndex].status === 'delivered') {
        return false; // Cannot cancel delivered orders
      }

      mockOrders[orderIndex].status = 'cancelled';
      mockOrders[orderIndex].updatedAt = new Date();

      // Update delivery tracking
      if (mockDeliveryTracking[orderId]) {
        mockDeliveryTracking[orderId].status = 'cancelled';
        mockDeliveryTracking[orderId].updates.push({
          timestamp: new Date(),
          status: 'Order cancelled',
          location: 'Restaurant',
        });
      }

      return true;
    } catch (error) {
      console.error('Error in cancelOrder:', error);
      return false;
    }
  },

  // Get order status options
  getOrderStatuses(): string[] {
    return [
      'pending',
      'confirmed',
      'preparing',
      'ready_for_pickup',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];
  },

  // Search orders by status
  async getOrdersByStatus(status: string, userId?: number): Promise<Order[]> {
    await delay(300);

    try {
      let filteredOrders = mockOrders.filter((order) => order.status === status);

      if (userId) {
        filteredOrders = filteredOrders.filter((order) => order.userId === userId);
      }

      return filteredOrders.map(normalizeOrder);
    } catch (error) {
      console.error('Error in getOrdersByStatus:', error);
      return [];
    }
  },
};

// Export individual functions for named imports
export const {
  getOrders,
  getOrder,
  getDeliveryTracking,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStatuses,
  getOrdersByStatus,
} = orderService;

// Default export
export default orderService;
