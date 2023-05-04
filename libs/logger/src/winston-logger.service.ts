import { Injectable } from '@nestjs/common';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { LogLevelOptions } from './types';
import { Logger } from './interfaces';

@Injectable()
export class WinstonLoggerService implements Logger {
  private logger: WinstonLogger;
  private level: string;
  private esTransportOpts = {
    level: 'info',
    indexPrefix: 'logs',
    indexSuffixPattern: 'YYYY-MM-DD',
    clientOpts: {
      node: 'http://localhost:9200',
      maxRetries: 5,
      requestTimeout: 10000,
      sniffOnStart: false,
    },
    source: process.env.LOG_SOURCE || 'api',
  };

  constructor({ level, serviceName }: LogLevelOptions) {
    this.level = level;

    this.logger = createLogger({
      level,
      format: format.json(),
      defaultMeta: { service: serviceName },
      transports: [
        new transports.Console({
          format: format.simple(),
        }),
        new ElasticsearchTransport(this.esTransportOpts),
      ],
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
