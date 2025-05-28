export declare const CACHE_KEY_METADATA = "cache_key";
export declare const CACHE_TTL_METADATA = "cache_ttl";
export declare const CacheKey: (key: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const CacheTTL: (ttl: number) => import("@nestjs/common").CustomDecorator<string>;
export declare const Cacheable: (key: string, ttl?: number) => (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
