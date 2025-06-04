import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService
  ) {}

  async findById(id: number): Promise<Omit<User, 'password'>> {
    const cacheKey = this.cacheService.generateUserKey(id);

    // Try to get from cache first
    const cachedUser = await this.cacheService.get<Omit<User, 'password'>>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;

    // Cache the result for 10 minutes
    await this.cacheService.set(cacheKey, userWithoutPassword, 600);

    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Invalidate cache for this user
    await this.cacheService.invalidateUserCache(id);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
