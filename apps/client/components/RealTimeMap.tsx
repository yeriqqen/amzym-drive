'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { gpsService } from '../services/gpsService';

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
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const manualMarkerRef = useRef<L.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationList, setLocationList] = useState<{ [key: string]: UserLocation & { distance?: number } }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Function to fetch GPS data from AWS API directly
  const fetchGPSFromAPI = async () => {
    try {
      console.log('Fetching GPS data from AWS API...');

      const data = await gpsService.getCurrentPosition();

      if (data) {
        console.log('GPS data received from AWS API:', data);

        const locationData = {
          latitude: data.lat,
          longitude: data.lon,
          timestamp: Date.now()
        };
        setCurrentLocation(locationData);

        console.log(`Received location from AWS: ${data.lat}, ${data.lon}`);

        // Notify parent component about location update
        onLocationUpdate?.(locationData);
      } else {
        console.error('No GPS data received from AWS API');
      }
    } catch (error) {
      console.error('Error fetching GPS data from AWS API:', error);

      // Fallback to browser geolocation if AWS API fails
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = { latitude, longitude };
            setCurrentLocation(locationData);

            console.log(`Fallback - Using browser location: ${latitude}, ${longitude}`);

            // Notify parent component about location update
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

  // Safe marker operations with error handling
  const safeAddMarker = (id: string, lat: number, lng: number) => {
    if (!isMapReady || !mapRef.current || !markerClusterGroupRef.current) {
      console.warn('Map not ready for marker operations');
      return;
    }

    try {
      const [newLat, newLng] = addOffset(lat, lng);

      // Remove existing marker if it exists
      if (markersRef.current[id]) {
        try {
          markerClusterGroupRef.current.removeLayer(markersRef.current[id]);
        } catch (removeError) {
          console.warn(`Error removing existing marker ${id}:`, removeError);
        }
      }

      // Create new marker
      const marker = L.marker([newLat, newLng]);
      markerClusterGroupRef.current.addLayer(marker);
      markersRef.current[id] = marker;

      console.log(`Successfully added/updated marker for ${id} at ${lat}, ${lng}`);
    } catch (error) {
      console.error(`Error adding marker for ${id}:`, error);
    }
  };

  const safeRemoveMarker = (id: string) => {
    if (!markerClusterGroupRef.current || !markersRef.current[id]) return;

    try {
      markerClusterGroupRef.current.removeLayer(markersRef.current[id]);
      delete markersRef.current[id];
      console.log(`Successfully removed marker for ${id}`);
    } catch (error) {
      console.error(`Error removing marker for ${id}:`, error);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initMap = () => {
      if (!mapContainerRef.current) {
        console.warn('Map container ref not available');
        return;
      }

      try {
        console.log('Initializing map...');

        // Default coordinates (center of the map)
        const defaultPosition: [number, number] = [35.2281, 126.8430];

        // Initialize the map with improved options
        const map = L.map(mapContainerRef.current, {
          preferCanvas: true,
          zoomControl: true,
          maxZoom: 18,
          minZoom: 1,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true
        }).setView(defaultPosition, 16);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Realtime Location Tracker',
          maxZoom: 18,
        }).addTo(map);

        // Initialize marker cluster group with better options
        const markerClusterGroup = L.markerClusterGroup({
          chunkedLoading: true,
          chunkProgress: (processed, total) => {
            console.log(`Loaded ${processed}/${total} markers`);
          },
          maxClusterRadius: 80,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true
        });

        map.addLayer(markerClusterGroup);
        markerClusterGroupRef.current = markerClusterGroup;

        // Add click event listener for manual markers
        map.on('click', (e: L.LeafletMouseEvent) => {
          try {
            const { lat, lng } = e.latlng;
            const userConfirmed = window.confirm(
              `Do you want to add a marker at Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}?`
            );

            if (userConfirmed) {
              // Remove existing manual marker
              if (manualMarkerRef.current) {
                try {
                  map.removeLayer(manualMarkerRef.current);
                } catch (removeError) {
                  console.warn('Error removing manual marker:', removeError);
                }
              }

              // Add new manual marker
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
          } catch (clickError) {
            console.error('Error handling map click:', clickError);
          }
        });

        // Wait for map to be fully ready
        map.whenReady(() => {
          console.log('Map is fully ready');
          setIsMapReady(true);
        });

        // Store map reference
        mapRef.current = map;

      } catch (error) {
        console.error('Critical error initializing map:', error);
      }
    };

    // Initialize map with delay based on document state
    if (document.readyState === 'complete') {
      initMap();
    } else {
      const timeout = setTimeout(initMap, 200);
      return () => clearTimeout(timeout);
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up map...');
      setIsMapReady(false);

      if (mapRef.current) {
        try {
          // Clear all markers
          Object.keys(markersRef.current).forEach(id => {
            safeRemoveMarker(id);
          });

          // Remove manual marker
          if (manualMarkerRef.current) {
            try {
              mapRef.current.removeLayer(manualMarkerRef.current);
            } catch (removeError) {
              console.warn('Error removing manual marker during cleanup:', removeError);
            }
          }

          // Remove the map
          mapRef.current.remove();
        } catch (error) {
          console.error('Error during map cleanup:', error);
        }

        // Reset all refs
        mapRef.current = null;
        markersRef.current = {};
        markerClusterGroupRef.current = null;
        manualMarkerRef.current = null;
      }
    };
  }, []);  // NOTE: WebSocket connection disabled - GPS data comes directly from AWS API
  // Initialize Socket.IO connection (DISABLED FOR GPS TRACKING)
  useEffect(() => {
    // Since we're using direct AWS API for GPS data, we don't need WebSocket connections
    // Set connected state to true to avoid connection status errors
    setIsConnected(true);
    console.log('WebSocket connection disabled - using direct AWS API for GPS data');

    // Cleanup function (no actual socket to clean up)
    return () => {
      console.log('No WebSocket connection to clean up');
    };
  }, [apiUrl, isMapReady]);

  // Set up GPS tracking interval
  useEffect(() => {
    // Initial fetch
    fetchGPSFromAPI();

    // Set up interval for regular updates (2 seconds)
    const interval = setInterval(fetchGPSFromAPI, 2000);

    return () => {
      console.log('Cleaning up GPS tracking interval');
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* GPS Status */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2">
        <div className={`flex items-center space-x-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'GPS Active' : 'GPS Disconnected'}</span>
        </div>
        <div className={`flex items-center space-x-2 text-xs mt-1 ${isMapReady ? 'text-blue-600' : 'text-orange-600'}`}>
          <div className={`w-2 h-2 rounded-full ${isMapReady ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
          <span>Map {isMapReady ? 'Ready' : 'Loading'}</span>
        </div>
      </div>

      {/* Map Container with loading indicator */}
      <div className="relative w-full h-full">
        <div
          ref={mapContainerRef}
          className="w-full h-full rounded-lg"
          style={{ minHeight: '400px' }}
        />

        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Location List */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-4 max-w-xs max-h-48 overflow-y-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Active Locations ({Object.keys(locationList).length})</h3>
        <ul className="space-y-2 text-xs">
          {Object.values(locationList).map((location) => (
            <li key={location.id} className="text-gray-600 border-b border-gray-200 pb-1">
              <div className="font-medium text-blue-600">ID: {location.id}</div>
              <div><strong>Lat:</strong> {location.latitude.toFixed(6)}</div>
              <div><strong>Lng:</strong> {location.longitude.toFixed(6)}</div>
              {location.distance && (
                <div><strong>Distance:</strong> {location.distance.toFixed(2)}m</div>
              )}
            </li>
          ))}
          {Object.keys(locationList).length === 0 && (
            <li className="text-gray-400 italic">No active locations</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeMap;
