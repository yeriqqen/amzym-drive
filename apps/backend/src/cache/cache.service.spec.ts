import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: any;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should retrieve value from cache', async () => {
      const key = 'test-key';
      const value = { data: 'test' };
      mockCacheManager.get.mockResolvedValue(value);

      const result = await service.get(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });
  });

  describe('set', () => {
    it('should store value in cache', async () => {
      const key = 'test-key';
      const value = { data: 'test' };
      const ttl = 300;

      await service.set(key, value, ttl);

      expect(cacheManager.set).toHaveBeenCalledWith(key, value, ttl);
    });
  });

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      const key = 'test-key';
      const cachedValue = { data: 'cached' };
      mockCacheManager.get.mockResolvedValue(cachedValue);

      const fetchFunction = jest.fn();
      const result = await service.getOrSet(key, fetchFunction);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(fetchFunction).not.toHaveBeenCalled();
      expect(result).toEqual(cachedValue);
    });

    it('should fetch and cache value if not cached', async () => {
      const key = 'test-key';
      const freshValue = { data: 'fresh' };
      mockCacheManager.get.mockResolvedValue(undefined);

      const fetchFunction = jest.fn().mockResolvedValue(freshValue);
      const result = await service.getOrSet(key, fetchFunction);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(fetchFunction).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(key, freshValue, undefined);
      expect(result).toEqual(freshValue);
    });
  });

  describe('key generators', () => {
    it('should generate correct user key', () => {
      const userId = 123;
      const key = service.generateUserKey(userId);
      expect(key).toBe('user:123');
    });

    it('should generate correct user orders key', () => {
      const userId = 123;
      const page = 2;
      const key = service.generateUserOrdersKey(userId, page);
      expect(key).toBe('user:123:orders:page:2');
    });

    it('should generate correct items key with category', () => {
      const category = 'pizza';
      const page = 1;
      const key = service.generateItemsKey(category, page);
      expect(key).toBe('items:category:pizza:page:1');
    });

    it('should generate correct items key without category', () => {
      const page = 1;
      const key = service.generateItemsKey(undefined, page);
      expect(key).toBe('items:page:1');
    });
  });

  describe('invalidateUserCache', () => {
    it('should delete multiple cache patterns for user', async () => {
      const userId = 123;

      await service.invalidateUserCache(userId);

      expect(cacheManager.del).toHaveBeenCalledTimes(4);
      expect(cacheManager.del).toHaveBeenCalledWith('user:123');
      expect(cacheManager.del).toHaveBeenCalledWith('user:123:*');
      expect(cacheManager.del).toHaveBeenCalledWith('stats:user:123');
      expect(cacheManager.del).toHaveBeenCalledWith('stats:global');
    });
  });
});
