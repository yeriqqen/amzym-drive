// Order and delivery tracking types
export interface OrderItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  quantity?: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  deliveryLocation?: DeliveryLocation;
  estimatedDeliveryTime?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface DeliveryLocation {
  lat: number;
  lng: number;
  address?: string;
  notes?: string;
}

export interface DeliveryStep {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  icon: string;
}

export interface DeliveryUpdate {
  timestamp: Date;
  status: string;
  location: string;
}

export interface DeliveryTracking {
  orderId: number;
  status: string;
  estimatedDeliveryTime: Date;
  currentLocation: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  managerInfo: {
    name: string;
    phone: string;
    department: string;
    role: string;
  };
  updates: DeliveryUpdate[];
}
