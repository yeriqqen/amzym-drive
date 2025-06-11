import { Module } from '@nestjs/common';
import { LocationGateway } from './location.gateway';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  providers: [LocationGateway, LocationService],
  controllers: [LocationController],
  exports: [LocationGateway, LocationService],
})
export class LocationModule {}
