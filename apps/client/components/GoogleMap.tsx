'use client';

import { useEffect, useRef } from 'react';

interface GoogleMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleMap({ onLocationSelect }: GoogleMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        // Wait for DOM to be ready and the ref to be available
        if (!mapRef.current) return;

        // Check if Google Maps API is loaded
        if (!window.google?.maps) {
            // Handle the case when Google Maps is not loaded yet
            const checkGoogleMapsLoaded = setInterval(() => {
                if (window.google?.maps) {
                    clearInterval(checkGoogleMapsLoaded);
                    initializeMap();
                }
            }, 100);

            return () => clearInterval(checkGoogleMapsLoaded);
        } else {
            initializeMap();
        }

        function initializeMap() {
            if (!mapRef.current) return;

            // Default center (Seoul)
            const defaultPosition = { lat: 37.5665, lng: 126.9780 };

            const map = new window.google.maps.Map(mapRef.current, {
                center: defaultPosition,
                zoom: 13,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });

            // Add click event listener
            map.addListener("click", (event: any) => {
                if (!event.latLng) return;

                const lat = event.latLng.lat();
                const lng = event.latLng.lng();

                // Remove existing marker if any
                if (markerRef.current) {
                    markerRef.current.setMap(null);
                }

                // Create new marker
                markerRef.current = new window.google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    animation: window.google.maps.Animation.DROP
                });

                // Call the callback with the selected location
                onLocationSelect(lat, lng);
            });

            // Get user's current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const currentPosition = { lat, lng };

                        map.setCenter(currentPosition);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    }
                );
            }

            return () => {
                // Cleanup marker on unmount
                if (markerRef.current) {
                    markerRef.current.setMap(null);
                }
            };
        }

    }, [onLocationSelect]);

    return (
        <div
            ref={mapRef}
            style={{ width: '100%', height: '400px' }}
            className="rounded-lg shadow-lg"
        />
    );
}