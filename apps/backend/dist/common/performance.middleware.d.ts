import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
export declare class PerformanceMiddleware implements NestMiddleware {
    private readonly logger;
    constructor(logger: LoggerService);
    use(req: Request, res: Response, next: NextFunction): void;
}
