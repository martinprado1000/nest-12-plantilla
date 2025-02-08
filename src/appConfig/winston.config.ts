import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import { CorrelationIdMiddleware } from 'src/middlewares/correlation-id.middleware';
import * as winston from 'winston';
import 'winston-mongodb';

// Definir tipo para metadata en logs
interface LogMeta {
  correlationId?: string;
  [key: string]: any;
}

// 🛠️ Función para obtener Correlation ID
const getCorrelationId = () => CorrelationIdMiddleware.getCorrelationId() || 'no-correlation-id';

// 🛠️ Formato de logs compartido
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD_HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `[${level.toUpperCase()}] ${timestamp} [Cid: ${getCorrelationId()}] ${message}`;
  }),
);

// 🛠️ Formato de logs en JSON (para MongoDB)
const mongoLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format((info) => {
    info.correlationId = getCorrelationId();
    return info;
  })(),
);

// 🛠️ Función para crear el logger
export const Logger = (configService: ConfigService): WinstonModuleOptions => ({
  format: logFormat,
  transports: [

    new winston.transports.Console({
      level: 'silly', // Configurado para registrar todos los niveles
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, context, trace }) => {
          return `[${level}] ${timestamp} [Cid: ${getCorrelationId()}] ${context || ''}: ${message}. Detail: ${trace || 'no-detail'}`;
        }),
      ),
    }),

    new winston.transports.MongoDB({
      level: 'info',
      //db: 'mongodb://localhost:27017/nest-10-plantilla',
      db: configService.get<string>('database.uri') || 'mongodb://localhost:27017/nest-10-plantilla',
      collection: 'logs',
      format: mongoLogFormat,
      
    }),
  ],
});


//------------------------------------------------
// import * as winston from 'winston';
// import 'winston-mongodb';

// Define un tipo para el meta que incluye correlationId
// interface LogMeta {
//   correlationId?: string;
//   [key: string]: any; // Permitir otros campos opcionales
// }

// // Configuración de Winston
// export const Logger = winston.createLogger({ 
//   level: 'silly', // Permitir logs de todos los niveles
//   format: winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD_HH:mm:ss' }),
//     winston.format.printf(({ timestamp, level, message, meta }: { timestamp: string; level: string; message: string; meta?: LogMeta }) => {
//       const correlationId = meta?.correlationId || 'N/A';
//       return `${timestamp} [${level.toUpperCase()}] [CorrelationId: ${correlationId}] ${message}`;
//     }),
//   ),
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(), // Colores en la consola
//       ),
//     }),
//     new winston.transports.MongoDB({
//       level: 'silly', // Guardar logs de todos los niveles
//       db: 'mongodb://localhost:27017/logs',
//       collection: 'application_logs',
//       tryReconnect: true,
//       options: { useUnifiedTopology: true },
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json(), // Guardar logs en formato JSON en MongoDB
//       ),
//     }),
//   ],
// });

// // Prueba de logs
// Logger.silly('Este es un mensaje de nivel silly');
// Logger.debug('Este es un mensaje de nivel debug');
// Logger.verbose('Este es un mensaje de nivel verbose');
// Logger.info('Este es un mensaje de nivel info');
// Logger.warn('Este es un mensaje de nivel warn');
// Logger.error('Este es un mensaje de nivel error');
