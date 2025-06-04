import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();

    // Override res.end to capture response time
    const originalEnd = res.end;
    res.end = function (...args: any[]) {
      const duration = Date.now() - startTime;
      const endMemory = process.memoryUsage();
      const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;

      // Log request performance
      const userAgent = req.get('User-Agent');
      this.logger.logRequest(req.method, req.originalUrl, res.statusCode, duration, userAgent);

      // Log memory usage if significant
      if (memoryDelta > 1024 * 1024) {
        // > 1MB
        this.logger.warn(
          `High memory usage: ${Math.round(memoryDelta / 1024 / 1024)}MB`,
          'Performance'
        );
      }

      // Log slow requests
      if (duration > 1000) {
        // > 1 second
        this.logger.warn(
          `Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`,
          'Performance'
        );
      }

      originalEnd.apply(this, args);
    }.bind(this);

    next();
  }
}
