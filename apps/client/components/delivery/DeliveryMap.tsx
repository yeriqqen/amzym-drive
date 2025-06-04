'use client';

import { useEffect, useRef, useState } from 'react';
import { DeliveryLocation } from '../../types/order';

interface DeliveryMapProps {
    deliveryLocation: DeliveryLocation;
    driverLocation?: DeliveryLocation;
    showRoute?: boolean;
    className?: string;
}

declare global {
    interface Window {
        google: any;
    }
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
    deliveryLocation,
    driverLocation,
    showRoute = false,
    className = ''
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const routeRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;

        function createMap() {
            // Clear existing markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // Clear existing route
            if (routeRef.current) {
                routeRef.current.setMap(null);
                routeRef.current = null;
            }

            // Create map centered on delivery location
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: deliveryLocation,
                zoom: 15,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });

            // Add delivery location marker
            const deliveryMarker = new window.google.maps.Marker({
                position: deliveryLocation,
                map: mapInstanceRef.current,
                title: 'Delivery Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#ff6600" stroke="white" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="18">🏠</text>
            </svg>
          `),
                    scaledSize: new window.google.maps.Size(40, 40),
                    anchor: new window.google.maps.Point(20, 20)
                }
            });
            markersRef.current.push(deliveryMarker);

            // Add delivery info window
            const deliveryInfoWindow = new window.google.maps.InfoWindow({
                content: `
          <div style="padding: 8px; max-width: 200px;">
            <strong>🏠 Delivery Location</strong><br/>
            ${deliveryLocation.address || 'Your delivery address'}<br/>
            ${deliveryLocation.notes ? `<small>${deliveryLocation.notes}</small>` : ''}
          </div>
        `
            });

            deliveryMarker.addListener('click', () => {
                deliveryInfoWindow.open(mapInstanceRef.current, deliveryMarker);
            });

            // Add driver location marker if provided
            if (driverLocation) {
                const driverMarker = new window.google.maps.Marker({
                    position: driverLocation,
                    map: mapInstanceRef.current,
                    title: 'Driver Location',
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#007bff" stroke="white" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">🚚</text>
              </svg>
            `),
                        scaledSize: new window.google.maps.Size(40, 40),
                        anchor: new window.google.maps.Point(20, 20)
                    }
                });
                markersRef.current.push(driverMarker);

                // Add driver info window
                const driverInfoWindow = new window.google.maps.InfoWindow({
                    content: `
            <div style="padding: 8px;">
              <strong>🚚 Your Driver</strong><br/>
              On the way to your location!
            </div>
          `
                });

                driverMarker.addListener('click', () => {
                    driverInfoWindow.open(mapInstanceRef.current, driverMarker);
                });

                // Show route if requested
                if (showRoute) {
                    const directionsService = new window.google.maps.DirectionsService();
                    const directionsRenderer = new window.google.maps.DirectionsRenderer({
                        suppressMarkers: true, // We already have custom markers
                        polylineOptions: {
                            strokeColor: '#007bff',
                            strokeWeight: 4,
                            strokeOpacity: 0.8
                        }
                    });

                    directionsService.route({
                        origin: driverLocation,
                        destination: deliveryLocation,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    }, (result: any, status: any) => {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                            directionsRenderer.setMap(mapInstanceRef.current);
                            routeRef.current = directionsRenderer;
                        }
                    });
                }

                // Adjust map bounds to show both markers
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend(deliveryLocation);
                bounds.extend(driverLocation);
                mapInstanceRef.current.fitBounds(bounds);

                // Ensure minimum zoom level
                const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
                    if (mapInstanceRef.current.getZoom() > 16) {
                        mapInstanceRef.current.setZoom(16);
                    }
                    window.google.maps.event.removeListener(listener);
                });
            }

            setIsLoaded(true);
        }

        // Wait for Google Maps script to be loaded globally
        if (window.google && window.google.maps) {
            createMap();
            setIsLoaded(true);
        } else {
            const interval = setInterval(() => {
                if (window.google && window.google.maps) {
                    createMap();
                    setIsLoaded(true);
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [deliveryLocation, driverLocation, showRoute]);

    return (
        <div className={`relative ${className}`}>
            <div
                ref={mapRef}
                className="w-full h-full rounded-lg shadow-lg"
                style={{ minHeight: '400px' }}
            />

            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007bff] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading delivery map...</p>
                    </div>
                </div>
            )}

            {/* Map Legend */}
            {isLoaded && (
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-[#ff6600] rounded-full flex items-center justify-center text-white text-xs">🏠</div>
                            <span>Delivery Location</span>
                        </div>
                        {driverLocation && (
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-[#007bff] rounded-full flex items-center justify-center text-white text-xs">🚚</div>
                                <span>Driver Location</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
