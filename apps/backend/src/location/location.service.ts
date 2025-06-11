import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LocationGateway } from './location.gateway';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

interface ConnectedUser {
  id: string;
  lastLocation?: LocationData;
}

interface AWSGPSResponse {
  lat: number;
  lon: number;
  timestamp: number;
}

@Injectable()
export class LocationService {
  constructor(private readonly locationGateway: LocationGateway) {}

  getConnectedUsersCount(): number {
    return this.locationGateway.getConnectedUsersCount();
  }

  getAllConnectedUsers(): ConnectedUser[] {
    return this.locationGateway.getAllConnectedUsers();
  }

  // Proxy method to fetch GPS data from AWS API
  async fetchGPSFromAWS(): Promise<LocationData> {
    try {
      const awsApiUrl = 'https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps';
      
      const response = await fetch(awsApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AmzymDrive-LocationService/1.0',
        },
      });

      if (!response.ok) {
        throw new HttpException(
          `AWS API request failed: ${response.status} ${response.statusText}`,
          HttpStatus.BAD_GATEWAY
        );
      }

      const data = await response.json() as AWSGPSResponse;
      
      if (!data.lat || !data.lon) {
        throw new HttpException(
          'Invalid GPS data received from AWS API',
          HttpStatus.BAD_GATEWAY
        );
      }

      return {
        latitude: data.lat,
        longitude: data.lon,
        timestamp: data.timestamp,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `Failed to fetch GPS data from AWS: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Simulate delivery tracking data for demo purposes
  getDeliveryTrackingData(orderId: number) {
    // This would typically come from a database
    // For now, return mock data that matches the existing interface
    return {
      orderId,
      status: 'OUT_FOR_DELIVERY',
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      currentLocation: {
        lat: 35.228950619029085 + (Math.random() - 0.5) * 0.01,
        lng: 126.8427269951037 + (Math.random() - 0.5) * 0.01,
      },
      destination: {
        lat: 35.2290,
        lng: 126.8435,
      },
      managerInfo: {
        name: 'Kim Min-jun',
        phone: '+82-10-1234-5678',
        department: 'Delivery Operations',
        role: 'Delivery Manager',
      },
      updates: [
        {
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: 'Order confirmed and preparing',
          location: 'Restaurant Kitchen',
        },
        {
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          status: 'Out for delivery',
          location: 'En route to destination',
        },
      ],
    };
  }
}
