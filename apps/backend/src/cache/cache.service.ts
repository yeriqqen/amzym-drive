import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  // Helper methods for common cache patterns
  async getOrSet<T>(key: string, fetchFunction: () => Promise<T>, ttl?: number): Promise<T> {
    const cachedValue = await this.get<T>(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const freshValue = await fetchFunction();
    await this.set(key, freshValue, ttl);
    return freshValue;
  }

  // Cache key generators
  generateUserKey(userId: number): string {
    return `user:${userId}`;
  }

  generateUserOrdersKey(userId: number, page = 1): string {
    return `user:${userId}:orders:page:${page}`;
  }

  generateItemsKey(category?: string, page = 1): string {
    return category ? `items:category:${category}:page:${page}` : `items:page:${page}`;
  }

  generateOrderKey(orderId: number): string {
    return `order:${orderId}`;
  }

  generateOrderStatsKey(userId?: number): string {
    return userId ? `stats:user:${userId}` : 'stats:global';
  }

  // Cache invalidation helpers
  async invalidateUserCache(userId: number): Promise<void> {
    const patterns = [
      this.generateUserKey(userId),
      `${this.generateUserKey(userId)}:*`,
      this.generateOrderStatsKey(userId),
      'stats:global',
    ];

    for (const pattern of patterns) {
      await this.del(pattern);
    }
  }

  async invalidateItemsCache(): Promise<void> {
    // This would require a more sophisticated pattern matching
    // For now, we'll clear specific known patterns
    const patterns = ['items:*'];

    for (const pattern of patterns) {
      await this.del(pattern);
    }
  }
}
