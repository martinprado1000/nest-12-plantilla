import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Le indico al modulo el nombre y el esquema que va a usar 
    ConfigModule,
    forwardRef(() => AuthModule) // forwardRef: Como el modulo User depende del de Auth tengo que importarlo con forwardRef para solucionar la dependencia circular
  ],
  controllers: [UsersController],
  providers: [UsersService, CustomLoggerService],
  exports: [UsersService],
})
export class UsersModule {}