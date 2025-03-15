// npm i bcrypt
// npm i -D @types/bcrypt
// npm install @nestjs/passport passport
// npm install @nestjs/jwt passport-jwt
// npm i -D @types/passport-jwt

import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';

@Module({

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  imports: [

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    ConfigModule,

    forwardRef(() => UsersModule), // forwardRef: Como el modulo Auth depende del de User tengo que importarlo con forwardRef para solucionar la dependencia circular

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule, UsersModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn:'8h'
          }
        }
      }
    })
    // JwtModule.register({   // Usamos la config de arriba porque es async para asegurarnos de levatar las variables de entorno.
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '2h',
    //   },
    // }),

  ],

  exports: [ AuthService, JwtStrategy, PassportModule, JwtModule, MongooseModule ], // Los exporto para el caso que necesite validar algo de jwt en otro lado.

})
export class AuthModule {}
