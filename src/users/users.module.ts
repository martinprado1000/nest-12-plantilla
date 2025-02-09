import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { CustomLoggerService } from '../logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { MongoUsersRepository, SqlUsersRepository } from './repositories';
import {
  USERS_REPOSITORY_INTERFACE,
} from './interfaces/users-repository.interface';
@Module({
  
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Le indico al modulo el nombre y el esquema que va a usar
    ConfigModule,
    forwardRef(() => AuthModule), // forwardRef: Como el modulo User depende del de Auth tengo que importarlo con forwardRef para solucionar la dependencia circular
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CustomLoggerService,
    MongoUsersRepository,
    SqlUsersRepository,

    // Asi podria inyectar el repositorio de mongo pero lo hacemos de la manera a continuacion para poder seleccionar entre una persistencia u otra segun el dato pasado por parametro.
    // {
    //   provide: USERS_REPOSITORY_INTERFACE,
    //   useClass: MongoUsersRepository 
    // },
    {
      provide: USERS_REPOSITORY_INTERFACE,
      inject: [ConfigService, MongoUsersRepository, SqlUsersRepository], // Inyecta las dependecias que vamos a necesitar en el use Factory
      useFactory: ( // El use Factory retorna lo que va a aplicar en el useClass por eso no lo usamos, lo da por sobreentendido.
        configService: ConfigService,
        mongoRepo: MongoUsersRepository,
        sqlRepo: SqlUsersRepository
      ) => {
        return configService.get<string>('database.persistence') || 'mongo' === 'mongo'  //   || 'mongo' :Si no viene nada el mongo de defecto.
          ? mongoRepo // useClass hace referencia al repo retornado.
          : sqlRepo;
      },
    },
  ],

  exports: [UsersService],
})
export class UsersModule {}
