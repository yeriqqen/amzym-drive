import { INestApplication, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    enableShutdownHooks(app: INestApplication): Promise<void>;
    findUserByEmail(email: string): Promise<any>;
    findUserByEmailWithPassword(email: string): Promise<any>;
    findOrdersByUserId(userId: number, limit?: number, offset?: number): Promise<any>;
    findItemsByCategory(category: string, limit?: number, offset?: number): Promise<any>;
    getOrderStats(userId?: number): Promise<any>;
}
