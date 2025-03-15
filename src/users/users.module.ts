import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigModule} from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from './users.repository';
import {
  USERS_REPOSITORY_INTERFACE,
} from './interfaces/users-repository.interface';
import { AuditLogsModule } from 'src/auditLogs/auditLogs.module';

@Module({

  controllers: [UsersController],
  
  providers: [ 
    UsersService,
    CustomLoggerService,
    UsersRepository,// Inyectamos la dependencia del repositorio indicandole que clase usar cuando llame a la interface USERS_REPOSITORY
    {
      provide: USERS_REPOSITORY_INTERFACE,
      useClass: UsersRepository 
    },
  ],
  
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Le indico al modulo el nombre y el esquema que va a usar
    ConfigModule, 
    forwardRef(() => AuthModule), // forwardRef: Como el modulo Users depende del de Auth tengo que importarlo con forwardRef para solucionar la dependencia circular
    AuditLogsModule
  ],

  exports: [UsersService],
})
export class UsersModule {}
