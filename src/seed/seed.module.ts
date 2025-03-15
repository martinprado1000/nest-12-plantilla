import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({

  controllers: [SeedController],

  providers: [SeedService],

  imports:[
    ConfigModule,
    UsersModule,
    AuthModule
  ]
  
})
export class SeedModule {}
