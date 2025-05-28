"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../cache/cache.service");
let OrdersService = class OrdersService {
    prisma;
    cacheService;
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async create(userId, data) {
        const order = await this.prisma.order.create({
            data: {
                userId,
                totalAmount: data.totalAmount,
                status: 'PENDING',
                items: {
                    connect: data.items.map((id) => ({ id })),
                },
            },
            include: {
                items: true,
            },
        });
        await this.cacheService.invalidateUserCache(userId);
        return order;
    }
    async findAllByUser(userId, page = 1, limit = 10) {
        const cacheKey = this.cacheService.generateUserOrdersKey(userId, page);
        const cachedOrders = await this.cacheService.get(cacheKey);
        if (cachedOrders) {
            return cachedOrders;
        }
        const orders = await this.prisma.findOrdersByUserId(userId, limit, (page - 1) * limit);
        await this.cacheService.set(cacheKey, orders, 300);
        return orders;
    }
    async findOne(id) {
        const cacheKey = this.cacheService.generateOrderKey(id);
        const cachedOrder = await this.cacheService.get(cacheKey);
        if (cachedOrder) {
            return cachedOrder;
        }
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        await this.cacheService.set(cacheKey, order, 600);
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: true,
            },
        });
        await this.cacheService.del(this.cacheService.generateOrderKey(id));
        await this.cacheService.invalidateUserCache(order.userId);
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map