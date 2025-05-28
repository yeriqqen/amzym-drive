import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
export declare class OrdersService {
    private prisma;
    private cacheService;
    constructor(prisma: PrismaService, cacheService: CacheService);
    create(userId: number, data: {
        items: number[];
        totalAmount: number;
    }): Promise<any>;
    findAllByUser(userId: number, page?: number, limit?: number): Promise<any>;
    findOne(id: number): Promise<any>;
    updateStatus(id: number, status: string): Promise<any>;
}
