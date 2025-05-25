import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface MapProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

const Map = ({ onLocationSelect }: MapProps) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Default coordinates (center of the map)
        const defaultPosition: [number, number] = [35.2281, 126.8430];

        if (mapContainerRef.current && !mapRef.current) {
            // Initialize the map
            const map = L.map(mapContainerRef.current).setView(defaultPosition, 16);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add click event listener to the map
            map.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;

                // Remove existing marker if any
                if (markerRef.current) {
                    map.removeLayer(markerRef.current);
                }

                // Add new marker at clicked position
                const marker = L.marker([lat, lng]).addTo(map);
                markerRef.current = marker;

                // Call the callback with the selected coordinates
                onLocationSelect(lat, lng);
            });

            mapRef.current = map;
        }

        // Cleanup function to destroy the map when component unmounts
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, [onLocationSelect]);

    return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default Map;