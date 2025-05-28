import { Order, DeliveryTracking, OrderStatus } from '../types/order';

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    totalAmount: 35.99,
    status: 'OUT_FOR_DELIVERY',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella, and basil',
        price: 18.99,
        category: 'food',
        image: '/api/placeholder/300/200',
        quantity: 1,
      },
      {
        id: 2,
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with caesar dressing',
        price: 12.99,
        category: 'food',
        image: '/api/placeholder/300/200',
        quantity: 1,
      },
      {
        id: 3,
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter',
        price: 4.99,
        category: 'food',
        image: '/api/placeholder/300/200',
        quantity: 1,
      },
    ],
    deliveryLocation: {
      lat: 37.5665,
      lng: 126.978,
      address: 'Seoul Station, Jung-gu, Seoul',
      notes: 'Building entrance near the main plaza',
    },
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins from now
  },
  {
    id: 2,
    userId: 1,
    totalAmount: 24.5,
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 4,
        name: 'Bulgogi Bowl',
        description: 'Korean BBQ beef with rice',
        price: 24.5,
        category: 'food',
        image: '/api/placeholder/300/200',
        quantity: 1,
      },
    ],
    deliveryLocation: {
      lat: 37.5172,
      lng: 127.0473,
      address: 'Gangnam Station, Gangnam-gu, Seoul',
    },
    estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
  },
];

const getDeliverySteps = (status: OrderStatus, createdAt: string) => {
  const steps = [
    {
      id: 'order-received',
      name: 'Order Received',
      status: 'completed' as const,
      timestamp: createdAt,
      icon: '📋',
    },
    {
      id: 'confirmed',
      name: 'Order Confirmed',
      status: status === 'PENDING' ? ('current' as const) : ('completed' as const),
      timestamp:
        status !== 'PENDING'
          ? new Date(new Date(createdAt).getTime() + 2 * 60 * 1000).toISOString()
          : undefined,
      icon: '✅',
    },
    {
      id: 'preparing',
      name: 'Preparing Food',
      status:
        status === 'PREPARING'
          ? ('current' as const)
          : ['CONFIRMED', 'PENDING'].includes(status)
            ? ('upcoming' as const)
            : ('completed' as const),
      timestamp: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)
        ? new Date(new Date(createdAt).getTime() + 10 * 60 * 1000).toISOString()
        : undefined,
      icon: '👨‍🍳',
    },
    {
      id: 'out-for-delivery',
      name: 'Out for Delivery',
      status:
        status === 'OUT_FOR_DELIVERY'
          ? ('current' as const)
          : status === 'DELIVERED'
            ? ('completed' as const)
            : ('upcoming' as const),
      timestamp:
        status === 'DELIVERED'
          ? new Date(new Date(createdAt).getTime() + 30 * 60 * 1000).toISOString()
          : undefined,
      icon: '🚚',
    },
    {
      id: 'delivered',
      name: 'Delivered',
      status: status === 'DELIVERED' ? ('completed' as const) : ('upcoming' as const),
      timestamp:
        status === 'DELIVERED'
          ? new Date(new Date(createdAt).getTime() + 45 * 60 * 1000).toISOString()
          : undefined,
      icon: '🎉',
    },
  ];

  return steps;
};

export const orderService = {
  // Get all orders for current user
  async getUserOrders(): Promise<Order[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockOrders;
  },

  // Get specific order by ID
  async getOrder(orderId: number): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockOrders.find((order) => order.id === orderId) || null;
  },

  // Get delivery tracking info
  async getDeliveryTracking(orderId: number): Promise<DeliveryTracking | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const order = mockOrders.find((order) => order.id === orderId);

    if (!order || !order.deliveryLocation) {
      return null;
    }

    const steps = getDeliverySteps(order.status, order.createdAt);
    const currentStep = steps.find((step) => step.status === 'current')?.id || 'delivered';

    return {
      orderId: order.id,
      currentStep,
      steps,
      estimatedDeliveryTime:
        order.estimatedDeliveryTime || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      deliveryLocation: order.deliveryLocation,
      driverInfo:
        order.status === 'OUT_FOR_DELIVERY'
          ? {
              name: '김민준 (Kim MinJun)',
              phone: '+82-10-1234-5678',
              vehicle: 'Honda Delivery Bike - 서울12가3456',
              currentLocation: {
                lat: 37.56,
                lng: 126.97,
              },
            }
          : undefined,
    };
  },

  // Get active deliveries (orders that are out for delivery)
  async getActiveDeliveries(): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockOrders.filter((order) => order.status === 'OUT_FOR_DELIVERY');
  },
};
