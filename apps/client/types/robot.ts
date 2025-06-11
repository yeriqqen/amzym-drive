export interface RobotPosition {
  lat: number;
  lon: number;
  timestamp: string;
  robotId: string;
  speed?: number;
  battery?: number;
  status?: 'active' | 'idle' | 'charging' | 'offline';
}

export interface RobotInfo {
  id: string;
  name: string;
  type: string;
  currentPosition: RobotPosition;
  status: string;
  battery: number;
  speed: number;
  lastUpdate: string;
}

export interface RobotTrackingHookReturn {
  currentPosition: RobotPosition | null;
  trail: RobotPosition[];
  isTracking: boolean;
  error: string | null;
  robotInfo: RobotInfo | null;
  startTracking: () => void;
  stopTracking: () => void;
  refreshPosition: () => Promise<void>;
}