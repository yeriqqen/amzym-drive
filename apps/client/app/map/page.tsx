'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gpsService } from '../../services/gpsService';

interface RobotPosition {
  lat: number;
  lon: number;
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const trailRef = useRef<any>(null);
  const [position, setPosition] = useState<RobotPosition>({ lat: 35.22901, lon: 126.85097 }); // Updated to match current API
  const [trail, setTrail] = useState<RobotPosition[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      import('leaflet').then((L) => {
        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current!).setView([position.lat, position.lon], 18);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Add marker
        markerRef.current = L.marker([position.lat, position.lon])
          .addTo(mapInstanceRef.current)
          .bindPopup('🤖 CampusBot<br/>Click Start Tracking for live updates');

        // Initialize empty trail
        trailRef.current = L.polyline([], {
          color: 'red',
          weight: 3,
          opacity: 0.7
        }).addTo(mapInstanceRef.current);
      });
    }
  }, []);

  // Update marker position when position changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([position.lat, position.lon]);
      mapInstanceRef.current.setView([position.lat, position.lon]);

      // Update popup with current coordinates
      markerRef.current.setPopupContent(
        `🤖 CampusBot<br/>📍 ${position.lat.toFixed(6)}, ${position.lon.toFixed(6)}<br/>🕐 ${new Date().toLocaleTimeString()}`
      );
    }
  }, [position]);

  // Update trail when position changes
  useEffect(() => {
    if (position && isTracking) {
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, position];
        // Keep only last 50 positions to avoid too long trail
        const limitedTrail = newTrail.slice(-50);

        // Update trail on map
        if (trailRef.current) {
          const trailCoords = limitedTrail.map(pos => [pos.lat, pos.lon]);
          trailRef.current.setLatLngs(trailCoords);
        }

        return limitedTrail;
      });
    }
  }, [position, isTracking]);

  const updatePosition = useCallback(async () => {
    try {
      console.log('Fetching GPS data from AWS API via GPS service...');
      const data = await gpsService.getCurrentPosition();

      if (!data) {
        throw new Error('No GPS data received from AWS API');
      }

      console.log('GPS data received:', data);
      console.log('Current position state:', position);
      console.log('New API coordinates:', `${data.lat}, ${data.lon}`);
      console.log('Previous coordinates:', `${position.lat}, ${position.lon}`);
      console.log('Position changed?', data.lat !== position.lat || data.lon !== position.lon);
      console.log('Is tracking?', isTracking);
      console.log('Timestamp:', new Date().toISOString());

      const newPosition = {
        lat: data.lat,
        lon: data.lon
      };

      console.log('Setting new position:', newPosition);
      setPosition(newPosition);
      setError(null);
      setLastUpdate(new Date());
      setRetryCount(0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch GPS data';
      setError(errorMsg);
      setRetryCount(prev => prev + 1);
      console.error('GPS fetch error:', err);

      // Auto-retry up to 3 times
      if (retryCount < 3 && isTracking) {
        console.log(`Retrying in 5 seconds... (attempt ${retryCount + 1}/3)`);
        setTimeout(updatePosition, 5000);
      }
    }
  }, [retryCount, isTracking, position]); // Add dependencies for useCallback

  const startTracking = () => {
    setIsTracking(true);
    setTrail([]); // Clear previous trail
    setError(null);
    setRetryCount(0);
    updatePosition(); // Get initial position
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const clearTrail = () => {
    setTrail([]);
    if (trailRef.current) {
      trailRef.current.setLatLngs([]);
    }
  };

  // Update position every 2 seconds when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking) {
      interval = setInterval(updatePosition, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, updatePosition]); // Added updatePosition to dependencies

  return (
    <>
      {/* Add Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet/dist/leaflet.css"
      />

      <div className="min-h-screen bg-white pt-20">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold m-0">📍 CampusBot Live GPS Tracker</h2>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={startTracking}
              disabled={isTracking}
              className={`px-6 py-3 rounded-lg font-semibold ${isTracking
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
              {isTracking ? 'Tracking...' : 'Start Tracking'}
            </button>

            <button
              onClick={stopTracking}
              disabled={!isTracking}
              className={`px-6 py-3 rounded-lg font-semibold ${!isTracking
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
            >
              Stop Tracking
            </button>

            <button
              onClick={clearTrail}
              className="px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            >
              Clear Trail
            </button>

            <button
              onClick={updatePosition}
              className="px-6 py-3 rounded-lg font-semibold bg-purple-500 hover:bg-purple-600 text-white"
            >
              📡 Refresh Now
            </button>
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700 text-lg">
                Status: {isTracking ? 'Live Tracking (Updates every 2 seconds)' : 'Stopped'}
              </span>
              {error && (
                <span className="text-red-500 ml-4 font-semibold">
                  ❌ {error}
                  {retryCount > 0 && ` (Retry ${retryCount}/3)`}
                </span>
              )}
              {lastUpdate && !error && (
                <span className="text-green-600 ml-4 text-sm">
                  ✅ Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Position Info */}
          <div className="text-center mb-6">
            <div className="bg-gray-100 rounded-lg p-4 inline-block">
              <h3 className="font-semibold text-gray-700 mb-2">Current Robot Position</h3>
              <div className="text-gray-600 font-mono">
                <div>📍 Latitude: {position.lat.toFixed(6)}</div>
                <div>📍 Longitude: {position.lon.toFixed(6)}</div>
                <div>🛤️ Trail Points: {trail.length}</div>
                {lastUpdate && (
                  <div className="text-xs text-gray-500 mt-1">
                    Last updated: {lastUpdate.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {isTracking ? 'Position updated in real-time' : 'Click Start Tracking to begin'}
              </div>
            </div>
          </div>

          {/* API Debug Info */}
          <div className="text-center mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
              <div className="text-sm text-blue-700">
                <div className="font-semibold">🔗 AWS API Endpoint:</div>
                <div className="font-mono text-xs mt-1">
                  https://2po3umzjt3.execute-api.ap-northeast-2.amazonaws.com/get-gps
                </div>
                <div className="mt-2 text-xs">
                  ⏱️ Update interval: 2 seconds | 🌍 Region: ap-northeast-2 (Seoul)
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div
            ref={mapRef}
            className="w-full border border-gray-300 rounded-lg"
            style={{ height: '90vh', minHeight: '500px' }}
          >
          </div>
        </div>
      </div>
    </>
  );
}