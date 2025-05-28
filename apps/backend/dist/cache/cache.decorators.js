"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacheable = exports.CacheTTL = exports.CacheKey = exports.CACHE_TTL_METADATA = exports.CACHE_KEY_METADATA = void 0;
const common_1 = require("@nestjs/common");
exports.CACHE_KEY_METADATA = 'cache_key';
exports.CACHE_TTL_METADATA = 'cache_ttl';
const CacheKey = (key) => (0, common_1.SetMetadata)(exports.CACHE_KEY_METADATA, key);
exports.CacheKey = CacheKey;
const CacheTTL = (ttl) => (0, common_1.SetMetadata)(exports.CACHE_TTL_METADATA, ttl);
exports.CacheTTL = CacheTTL;
const Cacheable = (key, ttl = 300) => {
    return (target, propertyName, descriptor) => {
        (0, common_1.SetMetadata)(exports.CACHE_KEY_METADATA, key)(target, propertyName, descriptor);
        (0, common_1.SetMetadata)(exports.CACHE_TTL_METADATA, ttl)(target, propertyName, descriptor);
    };
};
exports.Cacheable = Cacheable;
//# sourceMappingURL=cache.decorators.js.map