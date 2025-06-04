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
    const markersRef = useRef<any[]>([]);
    const directionsRendererRef = useRef<any>(null);

    // Default center (Gwangju area)
    const defaultCenter = {
        lat: 35.2286,
        lng: 126.8427
    };

    useEffect(() => {
        // Wait for Google Maps script to be loaded globally
        if (window.google && window.google.maps && mapRef.current && !mapInstanceRef.current) {
            setIsLoaded(true);
        } else {
            const interval = setInterval(() => {
                if (window.google && window.google.maps && mapRef.current && !mapInstanceRef.current) {
                    setIsLoaded(true);
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (isLoaded && mapRef.current && !mapInstanceRef.current) {
            // Initialize map
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: selectedLocation || defaultCenter,
                zoom: 14,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            });

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

    if (!isLoaded) {
        return (
            <div className={`h-80 w-full bg-gray-200 flex items-center justify-center rounded-lg ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
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