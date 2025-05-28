import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore as any,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      ttl: 300, // 5 minutes default TTL
      max: 1000, // Maximum number of items in cache
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, CacheModule],
})
export class CacheConfigModule {}
