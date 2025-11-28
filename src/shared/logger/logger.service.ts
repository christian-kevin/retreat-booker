import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private formatMessage(level: string, message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} [${level}] ${contextStr} ${message}`;
  }

  log(message: string, context?: string) {
    console.log(this.formatMessage('INFO', message, context));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(this.formatMessage('ERROR', message, context));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string, context?: string) {
    console.warn(this.formatMessage('WARN', message, context));
  }

  debug(message: string, context?: string) {
    console.debug(this.formatMessage('DEBUG', message, context));
  }

  verbose(message: string, context?: string) {
    console.log(this.formatMessage('VERBOSE', message, context));
  }
}

