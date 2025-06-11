import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RobotPosition } from '../../types/robot';

interface RobotTrackingMapProps {
  className?: string;
  enableTrail?: boolean;
  showRobotInfo?: boolean;
  positions?: RobotPosition[];
  currentPosition?: RobotPosition | null;
}

const RobotTrackingMap = ({ 
  className = "h-96 w-full", 
  enableTrail = true, 
  showRobotInfo = true,
  positions = [],
  currentPosition = null
}: RobotTrackingMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const trailRef = useRef<L.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Default position - GIST University campus
  const defaultPosition: [number, number] = [35.22901, 126.84288];

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize the map
      const map = L.map(mapContainerRef.current).setView(defaultPosition, 18);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Create robot icon
      const robotIcon = L.divIcon({
        html: `<div style="
          background: #3B82F6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">🤖</div>`,
        className: 'robot-marker',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13]
      });

      // Add initial robot marker
      const initialMarker = L.marker(defaultPosition, { icon: robotIcon }).addTo(map);
      if (showRobotInfo) {
        initialMarker.bindPopup("Robot location loading...");
      }
      markerRef.current = initialMarker;

      mapRef.current = map;
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        trailRef.current = null;
      }
    };
  }, [showRobotInfo]);

  // Update robot position
  useEffect(() => {
    if (mapRef.current && markerRef.current && currentPosition) {
      const position: [number, number] = [currentPosition.lat, currentPosition.lon];
      
      // Update marker position
      markerRef.current.setLatLng(position);
      
      // Update popup content if enabled
      if (showRobotInfo) {
        const popupContent = `
          <div style="font-family: system-ui; line-height: 1.4;">
            <strong>🤖 Robot Status</strong><br>
            <strong>Lat:</strong> ${currentPosition.lat.toFixed(6)}<br>
            <strong>Lon:</strong> ${currentPosition.lon.toFixed(6)}<br>
            <strong>Speed:</strong> ${currentPosition.speed || 0} km/h<br>
            <strong>Battery:</strong> ${currentPosition.battery || 100}%<br>
            <strong>Status:</strong> ${currentPosition.status || 'Active'}<br>
            <strong>Updated:</strong> ${new Date(currentPosition.timestamp).toLocaleTimeString()}
          </div>
        `;
        markerRef.current.setPopupContent(popupContent);
      }
      
      // Center map on robot position
      mapRef.current.setView(position, 18);
    }
  }, [currentPosition, showRobotInfo]);

  // Update trail
  useEffect(() => {
    if (mapRef.current && enableTrail && positions.length > 1) {
      // Remove existing trail
      if (trailRef.current) {
        mapRef.current.removeLayer(trailRef.current);
      }

      // Create new trail from positions
      const trailPoints: [number, number][] = positions.map(pos => [pos.lat, pos.lon]);
      
      const trail = L.polyline(trailPoints, {
        color: '#EF4444',
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1
      }).addTo(mapRef.current);
      
      trailRef.current = trail;
    }
  }, [positions, enableTrail]);

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />
    </div>
  );
};

export default RobotTrackingMap;