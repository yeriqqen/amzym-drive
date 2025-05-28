import { Cache } from 'cache-manager';
export declare class CacheService {
    private cacheManager;
    constructor(cacheManager: Cache);
    get<T>(key: string): Promise<T | undefined>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    getOrSet<T>(key: string, fetchFunction: () => Promise<T>, ttl?: number): Promise<T>;
    generateUserKey(userId: number): string;
    generateUserOrdersKey(userId: number, page?: number): string;
    generateItemsKey(category?: string, page?: number): string;
    generateOrderKey(orderId: number): string;
    generateOrderStatsKey(userId?: number): string;
    invalidateUserCache(userId: number): Promise<void>;
    invalidateItemsCache(): Promise<void>;
}
