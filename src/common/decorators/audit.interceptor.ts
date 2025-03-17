import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuditLogsService } from 'src/auditLogs/auditLogs.service';
import { Action } from 'src/auditLogs/enums/action.enums';
import { CreateAuditLogsDto } from 'src/auditLogs/dto/create-auditLogs.dto'; // Importamos el nuevo servicio
import { AUDIT_METADATA_KEY } from './audit.decorator';
import { ResolveEntityService } from 'src/resolve-entity/resolve-entity.service';
import { CustomLoggerService } from 'src/logger/logger.service';

// ********* ESTE INTERCEPTOR LEVANTA EL SERVISION PARA HACER EL findOneResponse DINAMICAMENTE.*************************

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private getAction(method: string): Action {
    switch (method) {
      case 'POST':
        return Action.create;
      case 'PATCH':
        return Action.update;
      case 'DELETE':
        return Action.delete;
      default:
        return Action.create;
    }
  }

  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogsService: AuditLogsService,
    private readonly resolveEntityService: ResolveEntityService,
    private readonly logger: CustomLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> { // Observable: como una "promesa mejorada" que puede emitir múltiples valores en lugar de solo uno.
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const method: 'POST' | 'PATCH' | 'DELETE' = req.method;
    const entity = context.getClass().name;
    const entityId: string = req.params.id;
    const action = this.getAction(method);

    //console.log(method)
    //console.log(entity)
    //console.log(entityId)

    const isAuditEnabled = this.reflector.get<boolean>(
      AUDIT_METADATA_KEY,
      context.getHandler(),
    );

    if (!isAuditEnabled) {
      return next.handle();  // next.handle(): continua con la ejecucion del programa
    }

    if (!user) {
      this.logger.error(
        'AuditInterceptor',
        'Necesita un usuario activo (Registrado) para aplicar el @auditInterceptor',
      );
      throw new InternalServerErrorException('Please check server logs');
    }

    const permitedMethods = ['POST', 'PATCH', 'DELETE'];
    if (!permitedMethods.includes(method)) {
      this.logger.error('AuditInterceptor','@auditInterceptor es aplicable solo a los métodos POST, PATCH, DELETE',
      );
      throw new InternalServerErrorException('Please check server logs');
    }

    // Si la acción es update o delete, obtenemos el estado previo ANTES de ejecutar el método del controlador. Obtener datos previos según la entidad
    return from(  // from() es para convertir la promesa en un Observable. Observable: como una "promesa mejorada" que puede emitir múltiples valores en lugar de solo uno.
      action === Action.update || action === Action.delete
        ? this.resolveEntityService.findOneResponse(entity, entityId)
        : Promise.resolve('Newly generated data'),
    ).pipe(   // pipe(): permite encadenar operadores en un Observable
      switchMap((beforeData) => // switchMap() : esperar la consulta antes de llamar a next.handle()
        next.handle().pipe(
          tap(async (result) => { // tap(): se usa en un pipe() para ejecutar código sin modificar los datos del flujo. Es útil para depuración o para realizar acciones secundarias como registrar datos o llamar a una función.
            // --------------------- Esto se ejecuta DESPUES del metodo --------------------------------------------
            const createAuditLogsDto: CreateAuditLogsDto = {
              entityAfected: entity,
              entityAfectedId: result.id,
              userIdAction: user._id,
              action,
              beforeData,
              afterData: result,
            };

            await this.auditLogsService.create(createAuditLogsDto);
          }),
          //catchError((error) => { // catchError: se obtiene de rxjs para poder cachear un posible error. Se ejecuta si ocurre un error en el controlador tambien.
          //  console.error(`Error en Auditoría: ${error.message}`);
          //  throw error;
          //}),
        ),
      ),
    );
  }
}
