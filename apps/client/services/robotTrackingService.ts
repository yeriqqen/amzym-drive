import { RobotPosition, RobotInfo } from '../types/robot';

// Your AWS API Gateway endpoint
const AWS_API_ENDPOINT = 'https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com';

export class RobotTrackingService {
  private static instance: RobotTrackingService;
  private updateInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(position: RobotPosition) => void> = new Set();

  static getInstance(): RobotTrackingService {
    if (!RobotTrackingService.instance) {
      RobotTrackingService.instance = new RobotTrackingService();
    }
    return RobotTrackingService.instance;
  }

  // Fetch current robot GPS position
  async getCurrentPosition(): Promise<RobotPosition | null> {
    try {
      const response = await fetch(`${AWS_API_ENDPOINT}/get-gps`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const position: RobotPosition = {
        lat: data.lat,
        lon: data.lon,
        timestamp: new Date().toISOString(),
        robotId: data.robotId || 'campus-bot-01',
        speed: data.speed || 0,
        battery: data.battery || 100,
        status: data.status || 'active'
      };

      // Notify all listeners
      this.notifyListeners(position);
      
      return position;
    } catch (error) {
      console.error('Failed to fetch robot position:', error);
      return null;
    }
  }

  // Get robot trail/history (if your API supports it)
  async getRobotTrail(robotId: string, hours: number = 1): Promise<RobotPosition[]> {
    try {
      const response = await fetch(`${AWS_API_ENDPOINT}/get-trail?robotId=${robotId}&hours=${hours}`);
      if (!response.ok) {
        return []; // Return empty array if trail endpoint doesn't exist yet
      }
      
      const data = await response.json();
      return data.positions || [];
    } catch (error) {
      console.error('Failed to fetch robot trail:', error);
      return [];
    }
  }

  // Start real-time tracking
  startTracking(intervalMs: number = 2000): void {
    this.stopTracking(); // Stop any existing tracking
    
    this.updateInterval = setInterval(async () => {
      await this.getCurrentPosition();
    }, intervalMs);

    // Get initial position
    this.getCurrentPosition();
  }

  // Stop real-time tracking
  stopTracking(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Subscribe to position updates
  subscribe(callback: (position: RobotPosition) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of position update
  private notifyListeners(position: RobotPosition): void {
    this.listeners.forEach(callback => callback(position));
  }

  // Get robot information (mock data for now, can be extended)
  async getRobotInfo(robotId: string): Promise<RobotInfo | null> {
    const position = await this.getCurrentPosition();
    if (!position) return null;

    return {
      id: robotId,
      name: 'CampusBot Delivery Robot',
      type: 'delivery',
      currentPosition: position,
      status: position.status || 'active',
      battery: position.battery || 100,
      speed: position.speed || 0,
      lastUpdate: position.timestamp
    };
  }
}

export const robotTrackingService = RobotTrackingService.getInstance();
