import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CustomLoggerService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // error(message: string, trace?: string, context?: string) {
  //   this.logger.error(message, { trace, context });
  // }

  // warn(message: string, context?: string) {
  //   this.logger.warn(message, { context });
  // }

  // log(message: string, context?: string) {
  //   this.logger.info(message, { context });
  // }

  // verbose(message: string, context?: string) {
  //   this.logger.verbose(message, { context });
  // }

  // debug(message: string, context?: string) {
  //   this.logger.debug(message, { context });
  // }

  error(message: string, context?: string, trace?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

}