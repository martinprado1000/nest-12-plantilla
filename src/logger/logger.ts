import * as winston from 'winston';
import 'winston-mongodb';

// Define un tipo para el meta que incluye correlationId
interface LogMeta {
  correlationId?: string;
  [key: string]: any; // Permitir otros campos opcionales
}

export const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, meta }: { timestamp: string; level: string; message: string; meta?: LogMeta }) => {
      const correlationId = meta?.correlationId || 'N/A';
      return `${timestamp} [${level.toUpperCase()}] [CorrelationId: ${correlationId}] ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, meta }: { timestamp: string; level: string; message: string; meta?: LogMeta }) => {
          const correlationId = meta?.correlationId || 'N/A';
          return `${timestamp} [${level.toUpperCase()}] [CorrelationId: ${correlationId}] ${message}`;
        }),
      ),
    }),
    new winston.transports.MongoDB({
      level: 'info',
      db: 'mongodb://localhost:27017/logs',
      collection: 'application_logs',
      tryReconnect: true,
      options: { useUnifiedTopology: true },
    }),
  ],
});
