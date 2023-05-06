import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

import { Logger } from '@app/logger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private configService: ConfigService,
    private logger: Logger
  ) {}

  @Get()
  @HealthCheck()
  @Throttle(10, 60)
  @HttpCode(HttpStatus.OK)
  check() {
    this.logger.debug('logg');
    return this.health.check([
      () => this.http.pingCheck('api', `${this.configService.get('API_HOST')}/api`),
      () => this.db.pingCheck('database')
    ]);
  }
}
