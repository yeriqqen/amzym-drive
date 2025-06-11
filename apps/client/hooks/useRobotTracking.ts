import { useState, useEffect, useCallback, useRef } from 'react';
import { RobotPosition, RobotInfo, RobotTrackingHookReturn } from '../types/robot';
import { robotTrackingService } from '../services/robotTrackingService';

export function useRobotTracking(): RobotTrackingHookReturn {
  const [currentPosition, setCurrentPosition] = useState<RobotPosition | null>(null);
  const [trail, setTrail] = useState<RobotPosition[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [robotInfo, setRobotInfo] = useState<RobotInfo | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Handle position updates from the service
  const handlePositionUpdate = useCallback((position: RobotPosition) => {
    setCurrentPosition(position);
    setError(null);
    
    // Add to trail (limit to last 50 positions)
    setTrail(prevTrail => {
      const newTrail = [...prevTrail, position];
      return newTrail.slice(-50); // Keep only last 50 positions
    });
    
    // Update robot info
    robotTrackingService.getRobotInfo(position.robotId).then(info => {
      if (info) {
        setRobotInfo(info);
      }
    });
  }, []);

  // Start tracking
  const startTracking = useCallback(() => {
    if (isTracking) return;
    
    setIsTracking(true);
    setError(null);
    
    // Subscribe to position updates
    unsubscribeRef.current = robotTrackingService.subscribe(handlePositionUpdate);
    
    // Start the tracking service
    robotTrackingService.startTracking(2000); // 2 second intervals
  }, [isTracking, handlePositionUpdate]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (!isTracking) return;
    
    setIsTracking(false);
    
    // Unsubscribe from updates
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    // Stop the tracking service
    robotTrackingService.stopTracking();
  }, [isTracking]);

  // Refresh position manually
  const refreshPosition = useCallback(async () => {
    try {
      setError(null);
      const position = await robotTrackingService.getCurrentPosition();
      if (position) {
        handlePositionUpdate(position);
      } else {
        setError('Failed to fetch robot position');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error refreshing position:', err);
    }
  }, [handlePositionUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      robotTrackingService.stopTracking();
    };
  }, []);

  // Handle service errors
  useEffect(() => {
    const originalGetCurrentPosition = robotTrackingService.getCurrentPosition.bind(robotTrackingService);
    
    robotTrackingService.getCurrentPosition = async function() {
      try {
        const result = await originalGetCurrentPosition();
        if (!result) {
          setError('No data received from robot API');
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect to robot API';
        setError(errorMessage);
        throw err;
      }
    };
    
    return () => {
      robotTrackingService.getCurrentPosition = originalGetCurrentPosition;
    };
  }, []);

  return {
    currentPosition,
    trail,
    isTracking,
    error,
    robotInfo,
    startTracking,
    stopTracking,
    refreshPosition
  };
}