'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Order, DeliveryTracking, DeliveryStep } from '../../types/order';
import { orderService } from '../../services/orderService';

// Import components dynamically to avoid SSR issues
const GoogleMap = dynamic(
    () => import('@/components/GoogleMap'),
    {
        ssr: false,
        loading: () => <div className="h-80 w-full bg-gray-200 flex items-center justify-center">Loading map...</div>
    }
);

const DeliveryMap = dynamic(
    () => import('../../components/delivery/DeliveryMap').then(mod => ({ default: mod.DeliveryMap })),
    {
        ssr: false,
        loading: () => <div className="h-80 w-full bg-gray-200 flex items-center justify-center">Loading delivery map...</div>
    }
);

const OrderSelector = dynamic(
    () => import('../../components/delivery/OrderSelector').then(mod => ({ default: mod.OrderSelector })),
    { ssr: false }
);

const OrderDetails = dynamic(
    () => import('../../components/delivery/OrderDetails').then(mod => ({ default: mod.OrderDetails })),
    { ssr: false }
);

const DeliverySteps = dynamic(
    () => import('../../components/delivery/DeliverySteps').then(mod => ({ default: mod.DeliverySteps })),
    { ssr: false }
);

const ManagerInfo = dynamic(
    () => import('../../components/delivery/ManagerInfo').then(mod => ({ default: mod.ManagerInfo })),
    { ssr: false }
);

const LocationSelector = dynamic(
    () => import('../../components/delivery/LocationSelector').then(mod => ({ default: mod.LocationSelector })),
    { ssr: false }
);

interface Location {
    lat: number;
    lng: number;
    address: string;
    name: string;
}

export default function MapPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'location' | 'tracking'>('location');
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [deliveryTracking, setDeliveryTracking] = useState<DeliveryTracking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [routeLocations, setRouteLocations] = useState<{
        start: Location;
        arrival: Location;
    } | null>(null);

    // Load orders on component mount
    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Loading orders...');
            const ordersData = await orderService.getOrders();
            console.log('Orders loaded:', ordersData);

            // Validate that orders have proper structure
            const validOrders = ordersData.filter(order => {
                const isValid = order &&
                    typeof order.id === 'number' &&
                    Array.isArray(order.items) &&
                    typeof order.totalAmount === 'number' &&
                    typeof order.status === 'string';

                if (!isValid) {
                    console.warn('Invalid order found:', order);
                }

                return isValid;
            });

            console.log('Valid orders:', validOrders);
            setOrders(validOrders);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
            setError(errorMessage);
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to convert delivery tracking to steps format
    const convertToDeliverySteps = (tracking: DeliveryTracking): DeliveryStep[] => {
        const stepDefinitions = [
            {
                id: 'order-received',
                name: 'Order Received',
                icon: '📋',
                statuses: ['confirmed', 'preparing', 'out_for_delivery', 'delivered']
            },
            {
                id: 'preparing',
                name: 'Preparing Food',
                icon: '👨‍🍳',
                statuses: ['preparing', 'out_for_delivery', 'delivered']
            },
            {
                id: 'out-for-delivery',
                name: 'Out for Delivery',
                icon: '🚚',
                statuses: ['out_for_delivery', 'delivered']
            },
            {
                id: 'delivered',
                name: 'Delivered',
                icon: '🎉',
                statuses: ['delivered']
            }
        ];

        return stepDefinitions.map((stepDef, index) => {
            let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
            let timestamp: string | undefined;

            if (stepDef.statuses.includes(tracking.status)) {
                if (tracking.status === stepDef.statuses[0] && index === stepDefinitions.findIndex(s => s.statuses[0] === tracking.status)) {
                    status = 'current';
                } else if (stepDef.statuses.includes(tracking.status) &&
                    stepDefinitions.findIndex(s => s.statuses[0] === tracking.status) > index) {
                    status = 'completed';
                } else if (stepDef.statuses[0] === tracking.status) {
                    status = 'current';
                }
            }

            // Find corresponding update for timestamp
            const relatedUpdate = tracking.updates.find(update =>
                update.status.toLowerCase().includes(stepDef.id.replace('-', ' ')) ||
                (stepDef.id === 'order-received' && update.status.toLowerCase().includes('received')) ||
                (stepDef.id === 'preparing' && update.status.toLowerCase().includes('preparing')) ||
                (stepDef.id === 'out-for-delivery' && update.status.toLowerCase().includes('delivery')) ||
                (stepDef.id === 'delivered' && update.status.toLowerCase().includes('delivered'))
            );

            if (relatedUpdate) {
                timestamp = relatedUpdate.timestamp.toISOString();
            }

            return {
                id: stepDef.id,
                name: stepDef.name,
                status,
                timestamp,
                icon: stepDef.icon
            };
        });
    };

    const handleLocationSelect = (location: { lat: number; lng: number }) => {
        setSelectedLocation(location);
    };

    const handleOrderSelect = async (order: Order) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Selected order:', order);

            // Validate order structure before proceeding
            if (!order || !Array.isArray(order.items)) {
                throw new Error('Invalid order structure');
            }

            const tracking = await orderService.getDeliveryTracking(order.id);
            console.log('Tracking data:', tracking);

            setSelectedOrder(order);
            setDeliveryTracking(tracking);
            setMode('tracking');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load delivery tracking';
            setError(errorMessage);
            console.error('Error loading delivery tracking:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToOrders = () => {
        setSelectedOrder(null);
        setDeliveryTracking(null);
        setMode('location');
    };

    const handleLocationChange = (startLocation: Location, arrivalLocation: Location) => {
        setRouteLocations({
            start: startLocation,
            arrival: arrivalLocation
        });

        // Update the selected location for the basic map
        setSelectedLocation({
            lat: startLocation.lat,
            lng: startLocation.lng
        });
    };

    const handleConfirmRoute = () => {
        if (routeLocations) {
            // Switch to delivery tracking mode with the selected route
            setMode('tracking');
            // You could create a mock order here or integrate with real order creation
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            loadOrders();
                        }}
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500">
                        {mode === 'location' ? 'Select Delivery Locations' : 'Track Your Delivery'}
                    </h1>
                    <p className="text-xl text-gray-700 mt-2">
                        {mode === 'location'
                            ? 'Choose your pickup and delivery points'
                            : 'Monitor your order in real-time'
                        }
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg p-1 shadow-md">
                        <button
                            onClick={() => setMode('location')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${mode === 'location'
                                ? 'bg-secondary text-white'
                                : 'text-gray-600 hover:text-secondary'
                                }`}
                        >
                            Location Selection
                        </button>
                        <button
                            onClick={() => setMode('tracking')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${mode === 'tracking'
                                ? 'bg-secondary text-white'
                                : 'text-gray-600 hover:text-secondary'
                                }`}
                        >
                            Delivery Tracking
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                )}

                {/* Location Selection Mode */}
                {mode === 'location' && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Location Selector */}
                        <div>
                            <LocationSelector
                                onLocationChange={handleLocationChange}
                                className="mb-6"
                            />

                            {routeLocations && (
                                <div className="text-center">
                                    <button
                                        onClick={handleConfirmRoute}
                                        className="px-8 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-lg transition-colors"
                                    >
                                        Confirm Route & Start Tracking
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Map Display */}
                        <div>
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Route Preview</h3>
                                <GoogleMap
                                    onLocationSelect={handleLocationSelect}
                                    selectedLocation={selectedLocation}
                                    routeLocations={routeLocations}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Delivery Tracking Mode */}
                {mode === 'tracking' && !loading && (
                    <>
                        {!selectedOrder ? (
                            <div>
                                <OrderSelector
                                    orders={orders}
                                    onOrderSelect={handleOrderSelect}
                                    className="mb-8"
                                />
                            </div>
                        ) : (
                            <div>
                                {/* Back Button */}
                                <div className="mb-6">
                                    <button
                                        onClick={handleBackToOrders}
                                        className="flex items-center space-x-2 text-secondary hover:text-secondary-dark font-semibold"
                                    >
                                        <span>←</span>
                                        <span>Back to Orders</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column - Order Details and Steps */}
                                    <div className="space-y-6">
                                        <OrderDetails order={selectedOrder} />
                                        {deliveryTracking && (
                                            <DeliverySteps
                                                steps={convertToDeliverySteps(deliveryTracking)}
                                            />
                                        )}
                                    </div>

                                    {/* Center Column - Map */}
                                    <div>
                                        {deliveryTracking && (
                                            <DeliveryMap
                                                deliveryLocation={{
                                                    lat: deliveryTracking.destination.lat,
                                                    lng: deliveryTracking.destination.lng,
                                                    address: 'Delivery Location'
                                                }}
                                                driverLocation={{
                                                    lat: deliveryTracking.currentLocation.lat,
                                                    lng: deliveryTracking.currentLocation.lng,
                                                    address: 'Current Location'
                                                }}
                                                showRoute={true}
                                                className="h-96"
                                            />
                                        )}
                                    </div>

                                    {/* Right Column - Manager Info */}
                                    <div>
                                        {deliveryTracking?.managerInfo && (
                                            <ManagerInfo
                                                managerInfo={deliveryTracking.managerInfo}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}