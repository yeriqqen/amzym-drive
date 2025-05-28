'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Order, DeliveryTracking } from '../../types/order';
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

const DriverInfo = dynamic(
    () => import('../../components/delivery/DriverInfo').then(mod => ({ default: mod.DriverInfo })),
    { ssr: false }
);

type MapMode = 'location-select' | 'delivery-tracking';

export default function MapPage() {
    const router = useRouter();
    const [mode, setMode] = useState<MapMode>('location-select');
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);

    // Delivery tracking state
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [deliveryTracking, setDeliveryTracking] = useState<DeliveryTracking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check URL parameters to determine initial mode
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const trackingMode = urlParams.get('mode');
        const orderId = urlParams.get('orderId');

        if (trackingMode === 'tracking' || orderId) {
            setMode('delivery-tracking');
            if (orderId) {
                setSelectedOrderId(parseInt(orderId));
            }
        }

        loadOrders();
    }, []);

    // Load user orders
    const loadOrders = async () => {
        try {
            setLoading(true);
            const userOrders = await orderService.getUserOrders();
            setOrders(userOrders);

            // Auto-select the first active order if none selected
            if (!selectedOrderId && userOrders.length > 0) {
                const activeOrder = userOrders.find(order =>
                    ['OUT_FOR_DELIVERY', 'PREPARING', 'CONFIRMED'].includes(order.status)
                ) || userOrders[0];

                if (activeOrder) {
                    setSelectedOrderId(activeOrder.id);
                }
            }
        } catch (err) {
            setError('Failed to load orders');
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load selected order details and tracking info
    useEffect(() => {
        if (selectedOrderId && mode === 'delivery-tracking') {
            loadOrderDetails(selectedOrderId);
        }
    }, [selectedOrderId, mode]);

    const loadOrderDetails = async (orderId: number) => {
        try {
            const [order, tracking] = await Promise.all([
                orderService.getOrder(orderId),
                orderService.getDeliveryTracking(orderId)
            ]);

            setSelectedOrder(order);
            setDeliveryTracking(tracking);
        } catch (err) {
            setError('Failed to load order details');
            console.error('Error loading order details:', err);
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
    };

    const confirmLocation = () => {
        if (selectedLocation) {
            // In a real app, you would save this location to your order state
            router.push('/status');
        } else {
            alert("Please select a location first!");
        }
    };

    const handleOrderSelect = (orderId: number) => {
        setSelectedOrderId(orderId);
        // Update URL to reflect selected order
        const url = new URL(window.location.href);
        url.searchParams.set('orderId', orderId.toString());
        window.history.replaceState({}, '', url.toString());
    };

    const toggleMode = () => {
        const newMode = mode === 'location-select' ? 'delivery-tracking' : 'location-select';
        setMode(newMode);

        // Update URL
        const url = new URL(window.location.href);
        if (newMode === 'delivery-tracking') {
            url.searchParams.set('mode', 'tracking');
        } else {
            url.searchParams.delete('mode');
            url.searchParams.delete('orderId');
        }
        window.history.replaceState({}, '', url.toString());
    };

    // Auto-refresh tracking data every 30 seconds for active deliveries
    useEffect(() => {
        if (mode === 'delivery-tracking' && selectedOrderId &&
            selectedOrder?.status === 'OUT_FOR_DELIVERY') {
            const interval = setInterval(() => {
                loadOrderDetails(selectedOrderId);
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [mode, selectedOrderId, selectedOrder?.status]);

    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary mx-auto mb-4"></div>
                    <p className="text-xl text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50">
            <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with mode toggle */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <button
                            onClick={toggleMode}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${mode === 'location-select'
                                ? 'bg-secondary text-white shadow-md'
                                : 'bg-white text-secondary border-2 border-secondary hover:bg-gray-50'
                                }`}
                        >
                            📍 Choose Location
                        </button>
                        <button
                            onClick={toggleMode}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${mode === 'delivery-tracking'
                                ? 'bg-secondary text-white shadow-md'
                                : 'bg-white text-secondary border-2 border-secondary hover:bg-gray-50'
                                }`}
                        >
                            🚚 Track Deliveries
                        </button>
                    </div>

                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-dark">
                        {mode === 'location-select' ? 'Choose Your Delivery Location' : 'Track Your Delivery'}
                    </h1>
                    <p className="text-xl text-gray-700 mt-2">
                        {mode === 'location-select'
                            ? 'Click anywhere on the map to select your drop-off point.'
                            : 'Monitor your order progress and delivery status in real-time.'
                        }
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {mode === 'location-select' ? (
                    // Location Selection Mode
                    <>
                        <div className="w-full h-96 border-4 border-primary rounded-lg overflow-hidden shadow-md mb-8">
                            <GoogleMap onLocationSelect={handleLocationSelect} />
                        </div>
                        <div className="text-center text-xl text-gray-700 mb-6">
                            Selected Location: <span className="font-bold">
                                {selectedLocation
                                    ? `Lat: ${selectedLocation.lat.toFixed(5)}, Lng: ${selectedLocation.lng.toFixed(5)}`
                                    : 'None'}
                            </span>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={confirmLocation}
                                className="px-8 py-4 bg-secondary hover:bg-secondary-dark text-white text-xl font-bold rounded-lg transform transition-transform hover:scale-105 shadow-md"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </>
                ) : (
                    // Delivery Tracking Mode
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Order Selection and Details */}
                        <div className="lg:col-span-1 space-y-6">
                            <OrderSelector
                                orders={orders}
                                selectedOrderId={selectedOrderId}
                                onOrderSelect={handleOrderSelect}
                            />

                            {selectedOrder && (
                                <OrderDetails order={selectedOrder} />
                            )}

                            {deliveryTracking?.driverInfo && (
                                <DriverInfo driverInfo={deliveryTracking.driverInfo} />
                            )}
                        </div>

                        {/* Right Column - Map and Delivery Steps */}
                        <div className="lg:col-span-2 space-y-6">
                            {selectedOrder?.deliveryLocation ? (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b">
                                        <h3 className="text-xl font-bold text-gray-700">Live Delivery Map</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Real-time tracking of your order delivery
                                        </p>
                                    </div>
                                    <div className="p-6">
                                        <DeliveryMap
                                            deliveryLocation={selectedOrder.deliveryLocation}
                                            driverLocation={deliveryTracking?.driverInfo?.currentLocation}
                                            showRoute={!!deliveryTracking?.driverInfo}
                                            className="h-96"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <div className="text-6xl mb-4">🗺️</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        Select an Order to Track
                                    </h3>
                                    <p className="text-gray-600">
                                        Choose an order from the list to see delivery details and map tracking.
                                    </p>
                                </div>
                            )}

                            {deliveryTracking && (
                                <DeliverySteps steps={deliveryTracking.steps} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}