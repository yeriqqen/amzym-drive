'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { io, Socket } from 'socket.io-client';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

interface UserLocation {
  id: string;
  latitude: number;
  longitude: number;
}

interface RealTimeMapProps {
  apiUrl?: string;
  className?: string;
  onLocationUpdate?: (location: LocationData) => void;
}

const RealTimeMap: React.FC<RealTimeMapProps> = ({
  apiUrl,
  className = '',
  onLocationUpdate,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const manualMarkerRef = useRef<L.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationList, setLocationList] = useState<{ [key: string]: UserLocation & { distance?: number } }>({});
  const [isConnected, setIsConnected] = useState(false);

  // Function to fetch GPS data from AWS API via backend proxy
  const fetchGPSFromAPI = async () => {
    try {
      const backendUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/location/gps-data`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const locationData = { 
          latitude: data.latitude, 
          longitude: data.longitude, 
          timestamp: data.timestamp 
        };
        setCurrentLocation(locationData);
        
        console.log(`Sending location from AWS API: ${data.latitude}, ${data.longitude} (timestamp: ${data.timestamp})`);
        
        if (socketRef.current) {
          socketRef.current.emit('send-location', locationData);
        }
        
        onLocationUpdate?.(locationData);
      } else {
        console.error('Invalid GPS data received from backend:', data);
      }
    } catch (error) {
      console.error('Error fetching GPS data from backend:', error);
      
      // Fallback to browser geolocation if backend API fails
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = { latitude, longitude };
            setCurrentLocation(locationData);
            
            console.log(`Fallback - Sending browser location: ${latitude}, ${longitude}`);
            
            if (socketRef.current) {
              socketRef.current.emit('send-location', locationData);
            }
            
            onLocationUpdate?.(locationData);
          },
          (error) => {
            console.log('Browser geolocation also failed:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Add small random offset to prevent overlapping markers
  const addOffset = (latitude: number, longitude: number): [number, number] => {
    const offset = 0.00001;
    const randomOffsetLat = (Math.random() - 0.5) * offset;
    const randomOffsetLng = (Math.random() - 0.5) * offset;
    return [latitude + randomOffsetLat, longitude + randomOffsetLng];
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Default coordinates (center of the map)
    const defaultPosition: [number, number] = [35.2281, 126.8430];

    // Initialize the map
    const map = L.map(mapContainerRef.current).setView(defaultPosition, 16);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Realtime Location Tracker',
    }).addTo(map);

    // Initialize marker cluster group
    const markerClusterGroup = L.markerClusterGroup();
    map.addLayer(markerClusterGroup);
    markerClusterGroupRef.current = markerClusterGroup;

    // Add click event listener for manual markers
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const userConfirmed = window.confirm(
        `Do you want to add a marker at Latitude: ${lat}, Longitude: ${lng}?`
      );
      
      if (userConfirmed) {
        if (manualMarkerRef.current) {
          map.removeLayer(manualMarkerRef.current);
        }
        
        manualMarkerRef.current = L.marker([lat, lng]).addTo(map);
        
        const distance = currentLocation
          ? calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              lat,
              lng
            )
          : null;

        setLocationList(prev => ({
          ...prev,
          manual: {
            id: 'manual',
            latitude: lat,
            longitude: lng,
            distance: distance || undefined,
          }
        }));
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
        markerClusterGroupRef.current = null;
        manualMarkerRef.current = null;
      }
    };
  }, [currentLocation]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const backendUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const socket = io(backendUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socket.on('receive-location', (data: UserLocation) => {
      const { id, latitude, longitude } = data;
      console.log(`Received location for ${id}: ${latitude}, ${longitude}`);

      if (mapRef.current && markerClusterGroupRef.current) {
        // Update map view to show the latest location
        mapRef.current.setView([latitude, longitude]);

        // Add offset to prevent overlapping
        const [newLat, newLng] = addOffset(latitude, longitude);

        // Update or create marker
        if (markersRef.current[id]) {
          markersRef.current[id].setLatLng([newLat, newLng]);
        } else {
          markersRef.current[id] = L.marker([newLat, newLng]).addTo(markerClusterGroupRef.current);
        }

        // Update location list
        setLocationList(prev => ({
          ...prev,
          [id]: { id, latitude, longitude }
        }));
      }
    });

    socket.on('user-disconnected', (id: string) => {
      console.log(`User disconnected: ${id}`);
      
      if (markersRef.current[id] && markerClusterGroupRef.current) {
        markerClusterGroupRef.current.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }

      setLocationList(prev => {
        const newList = { ...prev };
        delete newList[id];
        return newList;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [apiUrl]);

  // Set up GPS tracking interval
  useEffect(() => {
    // Fetch GPS data initially
    fetchGPSFromAPI();

    // Set up interval to fetch GPS data periodically (every 5 seconds)
    const interval = setInterval(fetchGPSFromAPI, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Connection Status */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2">
        <div className={`flex items-center space-x-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />

      {/* Location List */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-4 max-w-xs max-h-48 overflow-y-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Active Locations</h3>
        <ul className="space-y-1 text-xs">
          {Object.values(locationList).map((location) => (
            <li key={location.id} className="text-gray-600">
              <strong>ID:</strong> {location.id}<br />
              <strong>Lat:</strong> {location.latitude.toFixed(6)}<br />
              <strong>Lng:</strong> {location.longitude.toFixed(6)}
              {location.distance && (
                <>
                  <br />
                  <strong>Distance:</strong> {location.distance.toFixed(2)}m
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeMap;
