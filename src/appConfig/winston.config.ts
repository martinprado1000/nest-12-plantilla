import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import { CorrelationIdMiddleware } from '../common/middlewares/correlation-id.middleware';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import 'winston-mongodb';
import * as moment from 'moment';

// Definir tipo para metadata en logs
// interface LogMeta {
//   correlationId?: string;
//   context?: string;
//   messageDetail?: string;
// }

// 🔹 Función para obtener Correlation ID
const getCorrelationId = () => CorrelationIdMiddleware.getCorrelationId() || 'no-correlation-id';

// 🔹 Formato de logs compartido
const logFormatCompart = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD_HH:mm:ss' }),
);

const mongoLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD_HH:mm:ss' }),
  winston.format((info) => {
    info.correlationId = getCorrelationId();
    info.trace = info.trace || 'No-Trace'; 
    info.context = info.context || 'No-Context';
    return info;
  })(),
  winston.format.json(),
);


export const Logger = (configService: ConfigService): WinstonModuleOptions => ({
  //format: logFormat,
  transports: [

    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD_HH:mm:ss' }),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, context, trace }) => {
          return `[${level}] ${timestamp} [Cid: ${getCorrelationId()}] ${ context || 'No-Context'}: ${message}. Trace: ${ trace || 'No-Trace'}`;
        }),
      ),
    }),
    
    // Con este transport genera archivo de log y lo sobreescribe segun lo configurado en maxFiles.
    // new winston.transports.File({
    //   level: "http",
    //   filename: `./logsFiles/logs-${moment().format('YYYY-MM-DD')}.log`,
    //   maxsize: 5120000,       // Tamaño maximo del archivo en bits, cuando se completa crea otro archivo.
    //   //maxFiles: 3,          // "OJO" Cantidad maxima de archivos, luego del tercero se van sobreescribiendo.
    //   format: winston.format.combine(
    //     winston.format.timestamp({ format: 'YYYY-MM-DD_HH:mm:ss' }),
    //     winston.format.json(),
    //   ), 
    // }),

    //Con este transport genera varios archivo de log y los va rotando, Y genera archivo audit de la rotación.
    new winston.transports.DailyRotateFile({
      level: 'http',
      filename: `./logsFiles/logsRatate-%DATE%.log`,  // %DATE% será reemplazado por la fecha
      datePattern: 'YYYY-MM-DD',          // Formato de fecha en los archivos
      maxSize: '5m',                      // Máximo 5MB por archivo antes de rotar
      maxFiles: '3d',                     // Mantiene logs de los últimos 3 días
      zippedArchive: false,               // No comprimir archivos antiguos
      //auditFile: false,                 // No genera el archivo audit, se usa para rastrear y administrar la rotación de archivos de log.
      // Asi genera el log NO en JSON
      // format: winston.format.combine(
      //   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      //   winston.format.printf(({ level, message, timestamp, context, trace }) => {
      //     return `[${level}] ${timestamp} [Cid: ${getCorrelationId()}] ${ context || 'No-Context'}: ${message}. Trace: ${ trace || 'No-Trace'}`;
      //   }),
      // ),
      // Asi genera el log en JSON
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format(info => {
          return {
            ...info,
            correlationId: getCorrelationId(),
            trace: info.trace || 'No-Trace'
          };
        })(),
        winston.format.json()
      )
    }),    

    new winston.transports.MongoDB({
      level: 'http',
      format: mongoLogFormat,
      db: configService.get<string>('database.uri') || 'mongodb://localhost:27017/nest-11-plantilla',
      collection: 'logs',
    }),
    
  ],
});