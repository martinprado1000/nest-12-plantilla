import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfigFactory = (configService: ConfigService): MongooseModuleOptions => ({
  uri: 'mongodb://localhost:27017/nest-10-plantilla',
  // auth: {
  //   username: configService.get<string>('database.username'),
  //   password: configService.get<string>('database.password'),
  // },
});