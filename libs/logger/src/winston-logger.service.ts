import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

import { LogLevelOptions } from './types';
import { Logger } from './interfaces';
@Injectable()
export class WinstonLoggerService implements Logger {
  private logger: WinstonLogger;
  private level: string;
  // private logtail = new Logtail('imkzdZP5M5RG786FJRjr5xYt');

  constructor({ level, serviceName }: LogLevelOptions) {
    this.level = level;

    this.logger = createLogger({
      level,
      format: format.json(),
      defaultMeta: { service: serviceName },
      transports: [
        new transports.Console({
          format: format.simple()
        })
        // new LogtailTransport(this.logtail)
      ]
    });
  }

  log(message: string): void {
    this.logger.log({ level: this.level, message });
  }

  debug(message: string): void {
    this.logger.debug(message);
  }
  warn(message: string): void {
    this.logger.warn(message);
  }
  info(message: string): void {
    this.logger.info(message);
  }
  error(message: string, ...meta: any[]): void {
    this.logger.error(message, meta);
  }
}
