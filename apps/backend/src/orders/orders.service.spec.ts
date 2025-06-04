import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;
  let cacheService: CacheService;

  const mockOrder = {
    id: 1,
    userId: 1,
    totalAmount: 29.99,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { id: 1, name: 'Pizza', price: 15.99 },
      { id: 2, name: 'Soda', price: 2.99 },
    ],
  };

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    findOrdersByUserId: jest.fn(),
  };

  const mockCacheService = {
    generateUserOrdersKey: jest.fn(),
    generateOrderKey: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    invalidateUserCache: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create order and invalidate cache', async () => {
      const userId = 1;
      const orderData = {
        items: [1, 2],
        totalAmount: 29.99,
        startLat: 40.7128,
        startLng: -74.006,
        destLat: 40.7589,
        destLng: -73.9851,
      };

      mockPrismaService.order.create.mockResolvedValue(mockOrder);

      const result = await service.create(userId, orderData);

      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId,
          totalAmount: orderData.totalAmount,
          status: 'PENDING',
          items: {
            connect: orderData.items.map((id) => ({ id })),
          },
        },
        include: {
          items: true,
        },
      });
      expect(cacheService.invalidateUserCache).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findAllByUser', () => {
    it('should return cached orders if available', async () => {
      const userId = 1;
      const page = 1;
      const cacheKey = 'user:1:orders:page:1';
      const orders = [mockOrder];

      mockCacheService.generateUserOrdersKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(orders);

      const result = await service.findAllByUser(userId, page);

      expect(cacheService.generateUserOrdersKey).toHaveBeenCalledWith(userId, page);
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prismaService.findOrdersByUserId).not.toHaveBeenCalled();
      expect(result).toEqual(orders);
    });

    it('should fetch from database and cache if not in cache', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;
      const cacheKey = 'user:1:orders:page:1';
      const orders = [mockOrder];

      mockCacheService.generateUserOrdersKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(undefined);
      mockPrismaService.findOrdersByUserId.mockResolvedValue(orders);

      const result = await service.findAllByUser(userId, page, limit);

      expect(cacheService.generateUserOrdersKey).toHaveBeenCalledWith(userId, page);
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prismaService.findOrdersByUserId).toHaveBeenCalledWith(userId, limit, 0);
      expect(cacheService.set).toHaveBeenCalledWith(cacheKey, orders, 300);
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return cached order if available', async () => {
      const orderId = 1;
      const cacheKey = 'order:1';

      mockCacheService.generateOrderKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(mockOrder);

      const result = await service.findOne(orderId);

      expect(cacheService.generateOrderKey).toHaveBeenCalledWith(orderId);
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prismaService.order.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should fetch from database and cache if not in cache', async () => {
      const orderId = 1;
      const cacheKey = 'order:1';

      mockCacheService.generateOrderKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(undefined);
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(orderId);

      expect(cacheService.generateOrderKey).toHaveBeenCalledWith(orderId);
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: { items: true },
      });
      expect(cacheService.set).toHaveBeenCalledWith(cacheKey, mockOrder, 600);
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      const orderId = 999;
      const cacheKey = 'order:999';

      mockCacheService.generateOrderKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(undefined);
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(orderId)).rejects.toThrow(NotFoundException);
      expect(cacheService.set).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update order status and invalidate cache', async () => {
      const orderId = 1;
      const status = 'DELIVERED';
      const updatedOrder = { ...mockOrder, status };

      mockPrismaService.order.update.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus(orderId, status);

      expect(prismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status },
        include: { items: true },
      });
      expect(cacheService.del).toHaveBeenCalledWith('order:1');
      expect(cacheService.invalidateUserCache).toHaveBeenCalledWith(mockOrder.userId);
      expect(result).toEqual(updatedOrder);
    });
  });
});
