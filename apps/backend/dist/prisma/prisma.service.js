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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
    }
    async onModuleInit() {
        await this.$connect();
        await this.$executeRaw `SET statement_timeout = '30s'`;
        await this.$executeRaw `SET lock_timeout = '10s'`;
        await this.$executeRaw `SET idle_in_transaction_session_timeout = '60s'`;
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async enableShutdownHooks(app) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
    async findUserByEmail(email) {
        return this.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findUserByEmailWithPassword(email) {
        return this.user.findUnique({
            where: { email },
        });
    }
    async findOrdersByUserId(userId, limit = 10, offset = 0) {
        return this.order.findMany({
            where: { userId },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    async findItemsByCategory(category, limit = 20, offset = 0) {
        return this.item.findMany({
            where: { category },
            orderBy: { name: 'asc' },
            take: limit,
            skip: offset,
        });
    }
    async getOrderStats(userId) {
        const whereClause = userId ? { userId } : {};
        return this.order.aggregate({
            where: whereClause,
            _count: {
                id: true,
            },
            _sum: {
                totalAmount: true,
            },
            _avg: {
                totalAmount: true,
            },
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map