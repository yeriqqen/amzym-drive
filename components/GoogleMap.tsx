'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        google: any;
        initMap?: () => void;  // Make initMap optional to fix the delete operator error
    }
}

interface GoogleMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function GoogleMap({ onLocationSelect }: GoogleMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        // Define the initMap function globally
        window.initMap = () => {
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
        };

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyByrCNKe9kWY2M9EqIWwRSP3m804OSD8lA&callback=initMap";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            // Cleanup
            document.head.removeChild(script);
            delete window.initMap;
        };
    }, [onLocationSelect]);

    return (
        <div
            ref={mapRef}
            className="w-full h-full"
        />
    );
} 