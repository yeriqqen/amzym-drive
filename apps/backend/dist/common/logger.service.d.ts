import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class LoggerService extends Logger {
    private configService;
    constructor(configService: ConfigService);
    private formatMessage;
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    logPerformance(operation: string, duration: number, context?: string): void;
    logRequest(method: string, url: string, statusCode: number, duration: number, userAgent?: string): void;
    logQuery(query: string, duration: number, params?: any[]): void;
    logCache(operation: 'HIT' | 'MISS' | 'SET' | 'DEL', key: string, context?: string): void;
}
