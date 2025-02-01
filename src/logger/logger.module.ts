import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-mongodb';
import { CustomLoggerService } from './logger.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
