import { MiddlewareConsumer, Module, NestModule, Request } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import 'winston-mongodb';

import { envLoader } from './appConfig/envLoader.config';
import { envSchema } from './appConfig/envSchema.config';
import { winstonConfigFactory } from './appConfig/winston.config';
import { mongooseConfigFactory } from './appConfig/mongoose.config';

import { CommonModule } from './common/common.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { CorrelationIdMiddleware } from './middlewares/correlation-id.middleware';

@Module({
  imports: [
        // IMPORTANTE para usar el configModule en otros modulos hay que importarlo
    // npm i --save @nestjs/config  .Es para configurar las variables de entorno
    // npm i --save joi             .Es para validar las variables de entorno
    ConfigModule.forRoot({  // Obtiene variables de entorno y las valida segun le indiquemos. Por default las obtien de .env en la raiz
      load: [envLoader],            // Le indicamos de que archivo levantar las variables de entorno. Lo hago asi para poder estructurar mejor los datos.
      validationSchema: envSchema,  // Le indicamos cual es el archivo de validaciones de las variables de entorno (Los valores por defaul esta por escima de los valores por default que pudiera cargar en el envLoader)
      //isGlobal: true,             // Si dejo esta linea no haria falta importar el configModule en ningun modulo de ninguna entidad.  
    }),

    //MongooseModule.forRoot('mongodb://localhost:27017/Nest-02-plantilla'), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],    // IMPORTA ConfigModule para poder usarlo en el useFactory
      inject: [ConfigService],    // Inyecta el ConfigService
      useFactory: mongooseConfigFactory,
    }),

    // Configuración de Winston
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: winstonConfigFactory,
    }),

    ServeStaticModule.forRoot({  // Indicamos la ruta de nuestras archivos publicos
      rootPath: join(__dirname,'..','public'), 
    }),

    CommonModule,

    LoggerModule,
    
    AuthModule,

    UsersModule,

    SeedModule,

  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

