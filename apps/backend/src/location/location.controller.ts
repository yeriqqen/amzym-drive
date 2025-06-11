import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationService } from './location.service';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

interface ConnectedUser {
  id: string;
  lastLocation?: LocationData;
}

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('connected-users')
  @ApiOperation({ summary: 'Get count of connected users for real-time tracking' })
  @ApiResponse({ status: 200, description: 'Number of connected users' })
  getConnectedUsersCount() {
    return {
      count: this.locationService.getConnectedUsersCount(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('all-users')
  @ApiOperation({ summary: 'Get all connected users with their locations' })
  @ApiResponse({ status: 200, description: 'List of connected users and locations' })
  getAllConnectedUsers(): { users: ConnectedUser[]; timestamp: string } {
    return {
      users: this.locationService.getAllConnectedUsers(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('delivery-tracking/:orderId')
  @ApiOperation({ summary: 'Get delivery tracking data for an order' })
  @ApiResponse({ status: 200, description: 'Delivery tracking information' })
  getDeliveryTracking(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.locationService.getDeliveryTrackingData(orderId);
  }

  @Get('gps-data')
  @ApiOperation({ summary: 'Get GPS data from AWS API (proxy endpoint)' })
  @ApiResponse({ status: 200, description: 'GPS location data from AWS' })
  async getGPSData(): Promise<LocationData> {
    return await this.locationService.fetchGPSFromAWS();
  }
}
