import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

@WebSocketGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://amzymdrive.vercel.app', process.env.FRONTEND_URL].filter(Boolean)
      : true,
    credentials: true,
  },
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LocationGateway.name);
  private connectedUsers = new Map<string, { id: string; lastLocation?: LocationData }>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedUsers.set(client.id, { id: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
    // Notify other clients that this user disconnected
    this.server.emit('user-disconnected', client.id);
  }

  @SubscribeMessage('send-location')
  handleLocationUpdate(
    @MessageBody() locationData: LocationData,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Location received from ${client.id}: ${locationData.latitude}, ${locationData.longitude}`,
    );

    // Update user's location in memory
    const user = this.connectedUsers.get(client.id);
    if (user) {
      user.lastLocation = locationData;
    }

    // Broadcast location to all connected clients
    this.server.emit('receive-location', {
      id: client.id,
      ...locationData,
    });
  }

  @SubscribeMessage('request-all-locations')
  handleRequestAllLocations(@ConnectedSocket() client: Socket) {
    // Send all current user locations to the requesting client
    this.connectedUsers.forEach((user, socketId) => {
      if (user.lastLocation && socketId !== client.id) {
        client.emit('receive-location', {
          id: socketId,
          ...user.lastLocation,
        });
      }
    });
  }

  // Admin method to get all connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get all connected users with their last known locations
  getAllConnectedUsers() {
    return Array.from(this.connectedUsers.entries()).map(([socketId, user]) => ({
      id: socketId,
      lastLocation: user.lastLocation,
    }));
  }
}
