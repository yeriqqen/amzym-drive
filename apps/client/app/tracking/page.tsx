'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import the real-time map component dynamically
const RealTimeMap = dynamic(
  () => import('@/components/RealTimeMap'),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-200 flex items-center justify-center rounded-lg">Loading real-time map...</div>
  }
);

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

export default function RealTimeTrackingPage() {
  const router = useRouter();
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Fetch connected users count
  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/location/connected-users`);
        if (response.ok) {
          const data = await response.json();
          setConnectedUsers(data.count);
        }
      } catch (error) {
        console.error('Error fetching connected users:', error);
      }
    };

    fetchConnectedUsers();
    const interval = setInterval(fetchConnectedUsers, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLocationUpdate = (location: LocationData) => {
    setCurrentLocation(location);
    setIsTracking(true);
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  return (
    <div className="min-h-screen bg-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500">
            Real-Time Location Tracking
          </h1>
          <p className="text-xl text-gray-700 mt-2">
            Track deliveries and users in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">Connected Users</h3>
                <p className="text-2xl font-bold text-blue-600">{connectedUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">Tracking Status</h3>
                <p className={`text-2xl font-bold ${isTracking ? 'text-green-600' : 'text-gray-400'}`}>
                  {isTracking ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">Last Update</h3>
                <p className="text-sm text-gray-600">
                  {currentLocation ? 
                    new Date(currentLocation.timestamp || Date.now()).toLocaleTimeString() : 
                    'No data'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Location Info */}
        {currentLocation && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Current Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Latitude</label>
                <p className="text-lg font-mono text-gray-900">{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Longitude</label>
                <p className="text-lg font-mono text-gray-900">{currentLocation.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Tracking Controls</h3>
              <p className="text-gray-600">Manage your location tracking preferences</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/map')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Standard Map
              </button>
              <button
                onClick={toggleTracking}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isTracking 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Map */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Live Location Map</h3>
          <div className="h-96 w-full">
            <RealTimeMap
              className="h-full"
              onLocationUpdate={handleLocationUpdate}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• Your location is automatically tracked using GPS or browser geolocation</li>
            <li>• Other users' locations appear as markers on the map</li>
            <li>• Click anywhere on the map to add a manual marker</li>
            <li>• The system updates every 5 seconds for real-time tracking</li>
            <li>• All location data is shared in real-time with other connected users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
