import { LogLevel, LoggingProvider } from './logger.enum';

export interface LoggerOptions {
  engine: LoggingProvider;
  serviceName: string;
  level: LogLevel;
}

export interface LogLevelOptions {
  level: LogLevel;
  serviceName?: string;
}
