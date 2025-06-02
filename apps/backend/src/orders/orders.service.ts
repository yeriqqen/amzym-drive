import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {}

  async create(userId: number, data: { items: number[]; totalAmount: number }) {
    try {
      const order = await this.prisma.order.create({
        data: {
          userId,
          totalAmount: data.totalAmount,
          status: 'PENDING',
          items: {
            connect: data.items.map((id) => ({ id })),
          },
        },
        include: {
          items: true,
        },
      });

      // Invalidate user's order cache and stats
      await this.cacheService.invalidateUserCache(userId);

      return order;
    } catch (err) {
      console.error('OrderService.create error:', err, { userId, data });
      throw err;
    }
  }

  async findAllByUser(userId: number, page = 1, limit = 10) {
    const cacheKey = this.cacheService.generateUserOrdersKey(userId, page);

    // Try to get from cache first
    const cachedOrders = await this.cacheService.get<Order[]>(cacheKey);
    if (cachedOrders) {
      return cachedOrders;
    }

    const orders = await this.prisma.findOrdersByUserId(userId, limit, (page - 1) * limit);

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, orders, 300);

    return orders;
  }

  async findOne(id: number) {
    const cacheKey = this.cacheService.generateOrderKey(id);

    // Try to get from cache first
    const cachedOrder = await this.cacheService.get<Order>(cacheKey);
    if (cachedOrder) {
      return cachedOrder;
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Cache for 10 minutes
    await this.cacheService.set(cacheKey, order, 600);

    return order;
  }

  async updateStatus(id: number, status: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });

    // Invalidate caches
    await this.cacheService.del(this.cacheService.generateOrderKey(id));
    await this.cacheService.invalidateUserCache(order.userId);

    return order;
  }
}
