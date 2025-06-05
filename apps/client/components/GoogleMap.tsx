'use client';

import { useEffect, useRef, useState } from 'react';

interface Location {
    lat: number;
    lng: number;
    address: string;
    name: string;
}

interface GoogleMapProps {
    onLocationSelect?: (location: { lat: number; lng: number }) => void;
    selectedLocation?: { lat: number; lng: number } | null;
    routeLocations?: {
        start: Location;
        arrival: Location;
    } | null;
    className?: string;
}

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function GoogleMap({
    onLocationSelect,
    selectedLocation,
    routeLocations,
    className = ''
}: GoogleMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const markersRef = useRef<any[]>([]);
    const directionsRendererRef = useRef<any>(null);

    // Default center (Gwangju area)
    const defaultCenter = {
        lat: 35.2286,
        lng: 126.8427
    };

    useEffect(() => {
        // Wait for Google Maps script to be loaded globally
        console.log('GoogleMap: Checking for Google Maps API...');
        console.log('window.google exists:', !!window.google);
        console.log('window.google.maps exists:', !!(window.google && window.google.maps));
        console.log('mapRef.current exists:', !!mapRef.current);
        console.log('mapInstanceRef.current exists:', !!mapInstanceRef.current);

        if (window.google && window.google.maps && mapRef.current && !mapInstanceRef.current) {
            console.log('GoogleMap: API is ready, setting isLoaded to true');
            setIsLoaded(true);
        } else {
            console.log('GoogleMap: API not ready, starting interval check');
            let attempts = 0;
            const maxAttempts = 30; // 30 seconds timeout

            const interval = setInterval(() => {
                attempts++;
                console.log(`GoogleMap: Interval check ${attempts}/${maxAttempts} - API ready?`, !!(window.google && window.google.maps && mapRef.current && !mapInstanceRef.current));

                if (window.google && window.google.maps && mapRef.current && !mapInstanceRef.current) {
                    console.log('GoogleMap: API ready in interval, setting isLoaded to true');
                    setIsLoaded(true);
                    clearInterval(interval);
                } else if (attempts >= maxAttempts) {
                    console.log('GoogleMap: Timeout reached, setting error');
                    setLoadError('Failed to load Google Maps API. Please check your API key configuration.');
                    clearInterval(interval);
                }
            }, 1000);

            return () => {
                console.log('GoogleMap: Cleaning up interval');
                clearInterval(interval);
            };
        }
    }, []);

    useEffect(() => {
        if (isLoaded && mapRef.current && !mapInstanceRef.current) {
            try {
                console.log('GoogleMap: Initializing map...');
                // Initialize map
                mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                    center: selectedLocation || defaultCenter,
                    zoom: 14,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                console.log('GoogleMap: Map initialized successfully');

                // Add click listener for location selection
                if (onLocationSelect) {
                    mapInstanceRef.current.addListener('click', (event: any) => {
                        const lat = event.latLng.lat();
                        const lng = event.latLng.lng();
                        onLocationSelect({ lat, lng });
                    });
                }

                // Initialize directions renderer
                directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
                    draggable: false,
                    suppressMarkers: false,
                });
                directionsRendererRef.current.setMap(mapInstanceRef.current);
                console.log('GoogleMap: Directions renderer initialized');
            } catch (error) {
                console.error('GoogleMap: Error initializing map:', error);
            }
        }
    }, [isLoaded, onLocationSelect]);

    // Update markers and route when locations change
    useEffect(() => {
        if (!isLoaded || !mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        if (routeLocations) {
            // Show route between start and arrival points
            const directionsService = new window.google.maps.DirectionsService();

            const request = {
                origin: { lat: routeLocations.start.lat, lng: routeLocations.start.lng },
                destination: { lat: routeLocations.arrival.lat, lng: routeLocations.arrival.lng },
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result: any, status: any) => {
                if (status === 'OK') {
                    directionsRendererRef.current.setDirections(result);
                }
            });

            // Add custom markers
            const startMarker = new window.google.maps.Marker({
                position: { lat: routeLocations.start.lat, lng: routeLocations.start.lng },
                map: mapInstanceRef.current,
                title: routeLocations.start.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#22c55e" stroke="white" stroke-width="4"/>
                            <text x="16" y="20" font-family="Arial" font-size="12" fill="white" text-anchor="middle">S</text>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32),
                }
            });

            const arrivalMarker = new window.google.maps.Marker({
                position: { lat: routeLocations.arrival.lat, lng: routeLocations.arrival.lng },
                map: mapInstanceRef.current,
                title: routeLocations.arrival.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="4"/>
                            <text x="16" y="20" font-family="Arial" font-size="12" fill="white" text-anchor="middle">E</text>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32),
                }
            });

            markersRef.current = [startMarker, arrivalMarker];

            // Add info windows
            const startInfoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="padding: 8px;">
                        <h3 style="margin: 0 0 4px 0; color: #22c55e; font-weight: bold;">📍 ${routeLocations.start.name}</h3>
                        <p style="margin: 0; color: #666; font-size: 14px;">${routeLocations.start.address}</p>
                    </div>
                `
            });

            const arrivalInfoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="padding: 8px;">
                        <h3 style="margin: 0 0 4px 0; color: #ef4444; font-weight: bold;">🎯 ${routeLocations.arrival.name}</h3>
                        <p style="margin: 0; color: #666; font-size: 14px;">${routeLocations.arrival.address}</p>
                    </div>
                `
            });

            startMarker.addListener('click', () => {
                arrivalInfoWindow.close();
                startInfoWindow.open(mapInstanceRef.current, startMarker);
            });

            arrivalMarker.addListener('click', () => {
                startInfoWindow.close();
                arrivalInfoWindow.open(mapInstanceRef.current, arrivalMarker);
            });

            // Fit bounds to show both markers
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend({ lat: routeLocations.start.lat, lng: routeLocations.start.lng });
            bounds.extend({ lat: routeLocations.arrival.lat, lng: routeLocations.arrival.lng });
            mapInstanceRef.current.fitBounds(bounds);

        } else if (selectedLocation) {
            // Show single location marker
            directionsRendererRef.current.setDirections({ routes: [] });

            const marker = new window.google.maps.Marker({
                position: selectedLocation,
                map: mapInstanceRef.current,
                title: 'Selected Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="4"/>
                            <circle cx="16" cy="16" r="6" fill="white"/>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32),
                }
            });

            markersRef.current = [marker];
            mapInstanceRef.current.setCenter(selectedLocation);
            mapInstanceRef.current.setZoom(15);
        }
    }, [isLoaded, selectedLocation, routeLocations]);

    if (loadError) {
        return (
            <div className={`h-80 w-full bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
                <div className="text-center p-6">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Unavailable</h3>
                    <p className="text-gray-600 text-sm mb-4">{loadError}</p>
                    <p className="text-xs text-gray-500">
                        Please add a valid Google Maps API key to use the map feature.
                    </p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`h-80 w-full bg-gray-200 flex items-center justify-center rounded-lg ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {!window.google ? 'Waiting for Google Maps API...' : 'Initializing map...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div ref={mapRef} className="h-80 w-full rounded-lg" />

            {routeLocations && (
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 max-w-xs">
                    <h4 className="font-semibold text-gray-700 mb-2">Route Information</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-500">🟢</span>
                            <span className="truncate">{routeLocations.start.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-red-500">🔴</span>
                            <span className="truncate">{routeLocations.arrival.name}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}