'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        kakao: any;
    }
}

interface KakaoMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function KakaoMap({ onLocationSelect }: KakaoMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                if (!mapRef.current) return;

                // Default center (Seoul)
                const defaultPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);

                const options = {
                    center: defaultPosition,
                    level: 3
                };

                const map = new window.kakao.maps.Map(mapRef.current, options);

                // Add click event listener
                window.kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
                    const latlng = mouseEvent.latLng;

                    // Remove existing marker if any
                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                    }

                    // Create new marker
                    const marker = new window.kakao.maps.Marker({
                        position: latlng,
                        map: map
                    });

                    markerRef.current = marker;

                    // Call the callback with the selected location
                    onLocationSelect(latlng.getLat(), latlng.getLng());
                });

                // Get user's current location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            const currentPosition = new window.kakao.maps.LatLng(lat, lng);

                            map.setCenter(currentPosition);
                        },
                        (error) => {
                            console.error('Error getting location:', error);
                        }
                    );
                }
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [onLocationSelect]);

    return (
        <div
            ref={mapRef}
            className="w-full h-full"
        />
    );
} 