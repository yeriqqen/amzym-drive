'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import dynamic from 'next/dynamic';

// Import Leaflet components dynamically to avoid SSR issues
const Map = dynamic(
    () => import('../../components/Map'), // Adjusted path if needed
    {
        ssr: false,
        loading: () => <div className="h-80 w-full bg-gray-200 flex items-center justify-center">Loading map...</div>
    }
);

export default function MapPage() {
    const router = useRouter();
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);

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

    return (
        <div className="min-h-screen bg-[#fff8f0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                        Choose Your Delivery Location
                    </h1>
                    <p className="text-xl text-[#2c3e50] mt-2">
                        Click anywhere on the map to select your drop-off point.
                    </p>
                </div>
                <div className="w-full h-96 border-4 border-[#ff6600] rounded-lg overflow-hidden shadow-md mb-8">
                    <Map onLocationSelect={handleLocationSelect} />
                </div>
                <div className="text-center text-xl text-[#2c3e50] mb-6">
                    Selected Location: <span className="font-bold">
                        {selectedLocation
                            ? `Lat: ${selectedLocation.lat.toFixed(5)}, Lng: ${selectedLocation.lng.toFixed(5)}`
                            : 'None'}
                    </span>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={confirmLocation}
                        className="px-8 py-4 bg-[#007bff] hover:bg-[#0056b3] text-white text-xl font-bold rounded-lg transform transition-transform hover:scale-105 shadow-md"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
}