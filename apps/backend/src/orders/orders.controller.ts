import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Request() req,
    @Body()
    createOrderData: {
      items: number[];
      totalAmount: number;
      startLat: number;
      startLng: number;
      destLat: number;
      destLng: number;
    }
  ) {
    try {
      console.log('Create order request:', { userId: req.user.id, ...createOrderData });
      return await this.ordersService.create(req.user.id, createOrderData);
    } catch (err) {
      console.error('Order creation error:', err);
      throw err;
    }
  }

  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(+id, status);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    // Optionally, check if the user owns the order or is admin
    return this.ordersService.remove(req.user.id, +id);
  }
}
