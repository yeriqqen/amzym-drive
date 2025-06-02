import { INestApplication, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Enable query optimization
    await this.$executeRaw`SET statement_timeout = '30s'`;
    await this.$executeRaw`SET lock_timeout = '10s'`;
    await this.$executeRaw`SET idle_in_transaction_session_timeout = '60s'`;
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  // Helper methods for common queries with optimization
  async findUserByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findUserByEmailWithPassword(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  async findOrdersByUserId(userId: number, limit = 10, offset = 0) {
    return this.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findItemsByCategory(category: string, limit = 20, offset = 0) {
    return this.item.findMany({
      where: { category },
      orderBy: { name: 'asc' },
      take: limit,
      skip: offset,
    });
  }

  async getOrderStats(userId?: number) {
    const whereClause = userId ? { userId } : {};

    return this.order.aggregate({
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
      _avg: {
        totalAmount: true,
      },
    });
  }
}
