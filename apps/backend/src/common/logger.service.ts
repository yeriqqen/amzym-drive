import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService extends Logger {
  constructor(private configService: ConfigService) {
    super();
  }

  private formatMessage(level: string, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    const contextString = context ? `[${context}] ` : '';

    return `${timestamp} [${pid}] ${level.toUpperCase().padEnd(5)} ${contextString}${message}`;
  }

  log(message: string, context?: string) {
    const formatted = this.formatMessage('info', message, context);
    console.log(formatted);
  }

  error(message: string, trace?: string, context?: string) {
    const formatted = this.formatMessage('error', message, context);
    console.error(formatted);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string) {
    const formatted = this.formatMessage('warn', message, context);
    console.warn(formatted);
  }

  debug(message: string, context?: string) {
    if (this.configService.get('NODE_ENV') === 'development') {
      const formatted = this.formatMessage('debug', message, context);
      console.debug(formatted);
    }
  }

  verbose(message: string, context?: string) {
    if (this.configService.get('LOG_LEVEL') === 'verbose') {
      const formatted = this.formatMessage('verbose', message, context);
      console.log(formatted);
    }
  }

  // Performance logging
  logPerformance(operation: string, duration: number, context?: string) {
    const message = `${operation} completed in ${duration}ms`;
    if (duration > 1000) {
      this.warn(message, context);
    } else {
      this.log(message, context);
    }
  }

  // Request logging
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userAgent?: string
  ) {
    const message = `${method} ${url} ${statusCode} ${duration}ms ${userAgent || 'Unknown'}`;
    if (statusCode >= 400) {
      this.error(message, undefined, 'HTTP');
    } else {
      this.log(message, 'HTTP');
    }
  }

  // Database logging
  logQuery(query: string, duration: number, params?: any[]) {
    const paramsString = params ? ` - Params: ${JSON.stringify(params)}` : '';
    const message = `Query executed in ${duration}ms: ${query}${paramsString}`;

    if (duration > 100) {
      this.warn(message, 'Database');
    } else {
      this.debug(message, 'Database');
    }
  }

  // Cache logging
  logCache(operation: 'HIT' | 'MISS' | 'SET' | 'DEL', key: string, context?: string) {
    this.debug(`Cache ${operation}: ${key}`, context || 'Cache');
  }
}
