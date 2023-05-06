import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { LoggerOptions, LoggingProvider } from './types';
import { WinstonLoggerService } from './winston-logger.service';
import { Logger } from './interfaces';

@Module({})
export class LoggerModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    const loggerProvider = this.createLoggerProvider(options);
    return {
      global: true,
      module: LoggerModule,
      providers: [loggerProvider],
      exports: [loggerProvider]
    };
  }
  private static createLoggerProvider(options: LoggerOptions): Provider {
    switch (options.engine) {
      case LoggingProvider.WINSTON:
        return {
          provide: Logger,
          useFactory: () => {
            return new WinstonLoggerService(options);
          }
        };
      default:
        throw new Error(`Provide correct logger provider: ${options.engine}`);
    }
  }
}
