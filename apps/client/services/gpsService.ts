interface GPSData {
  lat: number;
  lon: number;
  timestamp: number;
  orderId?: string;
}

interface FormattedGPSData {
  latitude: number;
  longitude: number;
  timestamp: string;
  orderId?: string;
}

const GPS_API_URL = 'https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps';

export const gpsService = {
  // Get GPS data for a specific order
  async getGPSData(orderId?: string): Promise<FormattedGPSData[]> {
    try {
      const url = orderId ? `${GPS_API_URL}?orderId=${orderId}` : GPS_API_URL;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GPSData = await response.json();
      
      // Format the AWS API response to match frontend expectations
      const formattedData: FormattedGPSData = {
        latitude: data.lat,
        longitude: data.lon,
        timestamp: new Date(data.timestamp).toISOString(),
        orderId: orderId
      };

      return [formattedData];
    } catch (error) {
      console.error('Error fetching GPS data from AWS:', error);
      throw error;
    }
  },

  // Get latest GPS coordinates
  async getLatestCoordinates(orderId?: string): Promise<FormattedGPSData | null> {
    try {
      const gpsData = await this.getGPSData(orderId);
      return gpsData.length > 0 ? gpsData[gpsData.length - 1] : null;
    } catch (error) {
      console.error('Error fetching latest coordinates:', error);
      return null;
    }
  },

  // Start real-time GPS tracking with polling
  startTracking(
    orderId: string | undefined, 
    callback: (data: FormattedGPSData[]) => void, 
    interval: number = 5000
  ): () => void {
    const fetchData = async () => {
      try {
        const data = await this.getGPSData(orderId);
        callback(data);
      } catch (error) {
        console.error('GPS tracking error:', error);
        // Call callback with empty array on error to handle gracefully
        callback([]);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  },

  // Get current position for robot tracking (without orderId)
  async getCurrentPosition(): Promise<{ lat: number; lon: number } | null> {
    try {
      const response = await fetch(GPS_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GPSData = await response.json();
      return {
        lat: data.lat,
        lon: data.lon
      };
    } catch (error) {
      console.error('Error fetching current GPS position:', error);
      return null;
    }
  }
};

export default gpsService;
