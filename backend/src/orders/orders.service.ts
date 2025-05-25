import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: { items: number[]; totalAmount: number }) {
    return this.prisma.order.create({
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
  }

  async findAllByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });
  }
}
