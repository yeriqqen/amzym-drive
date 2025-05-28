"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheConfigModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
const cache_service_1 = require("./cache.service");
let CacheConfigModule = class CacheConfigModule {
};
exports.CacheConfigModule = CacheConfigModule;
exports.CacheConfigModule = CacheConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register({
                store: cache_manager_redis_store_1.redisStore,
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD,
                db: parseInt(process.env.REDIS_DB || '0'),
                ttl: 300,
                max: 1000,
            }),
        ],
        providers: [cache_service_1.CacheService],
        exports: [cache_service_1.CacheService, cache_manager_1.CacheModule],
    })
], CacheConfigModule);
//# sourceMappingURL=cache.module.js.map