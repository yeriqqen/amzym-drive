import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let cacheService: CacheService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockCacheService = {
    generateUserKey: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    invalidateUserCache: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return cached user if available', async () => {
      const userId = 1;
      const cacheKey = 'user:1';
      const { password, ...userWithoutPassword } = mockUser;

      mockCacheService.generateUserKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(userWithoutPassword);

      const result = await service.findById(userId);

      expect(cacheService.generateUserKey).toHaveBeenCalledWith(userId);
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prismaService.user.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual(userWithoutPassword);
    });

    it('should fetch from database and cache if not in cache', async () => {
      const userId = 1;
      const cacheKey = 'user:1';
      const { password, ...userWithoutPassword } = mockUser;

      mockCacheService.generateUserKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(cacheService.generateUserKey).toHaveBeenCalledWith(userId);
      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(cacheService.set).toHaveBeenCalledWith(cacheKey, userWithoutPassword, 600);
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      const cacheKey = 'user:999';

      mockCacheService.generateUserKey.mockReturnValue(cacheKey);
      mockCacheService.get.mockResolvedValue(undefined);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
      expect(cacheService.set).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const email = 'nonexistent@example.com';
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findByEmail(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user and invalidate cache', async () => {
      const userId = 1;
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateData };
      const { password, ...userWithoutPassword } = updatedUser;

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateData);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
      expect(cacheService.invalidateUserCache).toHaveBeenCalledWith(userId);
      expect(result).toEqual(userWithoutPassword);
    });
  });
});
