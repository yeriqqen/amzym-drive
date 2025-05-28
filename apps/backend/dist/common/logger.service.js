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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let LoggerService = class LoggerService extends common_1.Logger {
    configService;
    constructor(configService) {
        super();
        this.configService = configService;
    }
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const pid = process.pid;
        const contextString = context ? `[${context}] ` : '';
        return `${timestamp} [${pid}] ${level.toUpperCase().padEnd(5)} ${contextString}${message}`;
    }
    log(message, context) {
        const formatted = this.formatMessage('info', message, context);
        console.log(formatted);
    }
    error(message, trace, context) {
        const formatted = this.formatMessage('error', message, context);
        console.error(formatted);
        if (trace) {
            console.error(trace);
        }
    }
    warn(message, context) {
        const formatted = this.formatMessage('warn', message, context);
        console.warn(formatted);
    }
    debug(message, context) {
        if (this.configService.get('NODE_ENV') === 'development') {
            const formatted = this.formatMessage('debug', message, context);
            console.debug(formatted);
        }
    }
    verbose(message, context) {
        if (this.configService.get('LOG_LEVEL') === 'verbose') {
            const formatted = this.formatMessage('verbose', message, context);
            console.log(formatted);
        }
    }
    logPerformance(operation, duration, context) {
        const message = `${operation} completed in ${duration}ms`;
        if (duration > 1000) {
            this.warn(message, context);
        }
        else {
            this.log(message, context);
        }
    }
    logRequest(method, url, statusCode, duration, userAgent) {
        const message = `${method} ${url} ${statusCode} ${duration}ms ${userAgent || 'Unknown'}`;
        if (statusCode >= 400) {
            this.error(message, undefined, 'HTTP');
        }
        else {
            this.log(message, 'HTTP');
        }
    }
    logQuery(query, duration, params) {
        const paramsString = params ? ` - Params: ${JSON.stringify(params)}` : '';
        const message = `Query executed in ${duration}ms: ${query}${paramsString}`;
        if (duration > 100) {
            this.warn(message, 'Database');
        }
        else {
            this.debug(message, 'Database');
        }
    }
    logCache(operation, key, context) {
        this.debug(`Cache ${operation}: ${key}`, context || 'Cache');
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map