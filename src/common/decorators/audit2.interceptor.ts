import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs'; 
import { switchMap, tap } from 'rxjs/operators';
import { AuditLogsService } from 'src/auditLogs/auditLogs.service';
import { Action } from 'src/auditLogs/enums/action.enums';
import { CreateAuditLogsDto } from 'src/auditLogs/dto/create-auditLogs.dto'; // Importamos el nuevo servicio
import { AUDIT_METADATA_KEY } from './audit.decorator';
import { ResolveEntityService } from './resolve-entity.service';

@Injectable()
export class AuditInterceptor2 implements NestInterceptor {
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
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const method: 'POST' | 'PATCH' | 'DELETE' = req.method;
    const entity = context.getClass().name;
    const entityId: string = req.params.id;
    const action = this.getAction(method);

    const isAuditEnabled = this.reflector.get<boolean>(
      AUDIT_METADATA_KEY,
      context.getHandler(),
    );

    if (!isAuditEnabled) {
      return next.handle();
    }

    // Obtener datos previos según la entidad
    return from(
      action === Action.update || action === Action.delete
        ? this.resolveEntityService.findOne(entity, entityId)
        : Promise.resolve('Newly generated data'),
    ).pipe(
      switchMap((beforeData) =>
        next.handle().pipe(
          tap(async (result) => {
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
        ),
      ),
    );
  }
}

