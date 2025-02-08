import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CustomLoggerService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  error(message: string, context?: string, trace?: string) { // Errores críticos que detienen la ejecución de la aplicación.
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string, trace?: string) { // Advertencias sobre posibles problemas que no afectan la ejecución inmediata.
    this.logger.warn(message, { trace, context });
  }

  // Para auditoria.
  log(message: string, context?: string, trace?: string) { // Información general del sistema. Este nivel seria para llevar a cabo un auditoria.
    this.logger.info(message, { trace, context });
  }
  // Para auditoria de una api.
  http(message: string, context?: string, trace?: string) { // Registros de peticiones HTTP y respuestas del servidor. Este nivel seria para llevar a cabo un auditoria de una api.
    this.logger.http(message, { trace, context });
  }

  verbose(message: string, context?: string, trace?: string) { // Información detallada sobre la ejecución (útil para depuración avanzada). 
    this.logger.verbose(message, { trace, context });
  }

  debug(message: string, context?: string, trace?: string) { // Mensajes usados para depuración (detalles internos del código).
    this.logger.debug(message, { trace, context });
  }

  silly(message: string, context?: string, trace?: string) { // Información extremadamente detallada (rara vez necesario).
    this.logger.silly(message, { trace, context });
  }

//  Ejemplos:
// logger.error('Error crítico en la base de datos');
// logger.warn('Usuario intentó acceder sin permisos');
// logger.info('Servidor iniciado en el puerto 3000');
// logger.http('GET /api/products 200 OK');
// logger.verbose('Carga de configuración completada');
// logger.debug('Variable X tiene el valor esperado');
// logger.silly('El sistema usó 0.0001ms en esta operación');

}
