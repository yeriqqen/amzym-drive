import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    private cacheService;
    constructor(prisma: PrismaService, cacheService: CacheService);
    findById(id: number): Promise<Omit<User, 'password'>>;
    findByEmail(email: string): Promise<User>;
    updateUser(id: number, data: Partial<User>): Promise<Omit<User, 'password'>>;
}
