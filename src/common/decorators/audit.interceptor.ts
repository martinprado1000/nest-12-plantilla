// import { Reflector } from '@nestjs/core';
// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { AuditLogsService } from 'src/auditLogs/auditLogs.service';
// import { Action } from 'src/auditLogs/enums/action.enums';
// import { CreateAuditLogsDto } from 'src/auditLogs/dto/create-auditLogs.dto';
// import { UsersService } from 'src/users/users.service';
// import { CreateUserDto, ResponseUserDto } from 'src/users/dto';
// import { AUDIT_METADATA_KEY } from './audit.decorator';

// @Injectable()
// export class AuditInterceptor implements NestInterceptor {
//   private getAction(method: string): Action {
//     switch (method) {
//       case 'POST':
//         return Action.create;
//       case 'PATCH':
//         return Action.update;
//       case 'DELETE':
//         return Action.delete;
//       default:
//         return Action.create;
//     }
//   }

//   constructor(
//     private readonly reflector: Reflector,
//     private readonly auditLogsService: AuditLogsService,
//     private readonly usersService: UsersService,
//   ) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const req = context.switchToHttp().getRequest(); // Obtener la request
//     const user: CreateUserDto = req.user; // Usuario autenticado (viene del middleware de auth)
//     const method: 'POST' | 'PATCH' | 'DELETE' = req.method; // Método HTTP (POST, PATCH, DELETE, etc.)
//     const entity = context.getClass().name; // Nombre del controlador
//     const entityId: string = req.params.id; // ID de la entidad afectada
//     const action = this.getAction(method); // Convertir el método en acción de auditoría
//     let beforeData: object | string;
//     let createAuditLogsDto: CreateAuditLogsDto;

//     // Verificar si la auditoría está habilitada en este método o controlador
//     const isAuditEnabled = this.reflector.get<boolean>(
//       AUDIT_METADATA_KEY,
//       context.getHandler(),
//     );

//     // Si no tiene el decorador @Audit(), continuar sin auditar
//     if (!isAuditEnabled) {
//       return next.handle(); 
//     }

//     // console.log(user)
//     // console.log(user._id)
//     // console.log(method)
//     // console.log(entity)
//     // console.log(entityId)
//     // console.log(action)

//     if (action === 'update' || action === 'delete') { // Si el metodo es update o delete busco el dato actual antes de generar la auditoria para guardar el dato.
//       (async () => {
//         beforeData = await this.usersService.findOneResponse(entityId);
//       })();
//     }

//     return next.handle().pipe(
//       tap(async (result: ResponseUserDto) => {
//         // --------------------- Esto se ejecuta DESPUES del metodo ------------------------------------------------
//         // Se ejecuta cuando el método del controlador finaliza correctamente
//         //console.log(result)
//         beforeData = await this.usersService.findOneResponse(entityId);

//         createAuditLogsDto = {
//           entityAfected: entity,
//           entityAfectedId: result.id,
//           userIdAction: user._id,
//           action,
//           beforeData: beforeData ? beforeData : 'Newly generated data', // Si la accion fue update o delete existe beforeData por lo tanto lo agrega
//           afterData: result,
//         };

//         await this.auditLogsService.logEvent(createAuditLogsDto);
//         return result;
//       }),
//       // catchError((error) => { // catchError: se obtiene de rxjs para poder cachear un posible error
//       //   // Se ejecuta si ocurre un error en el controlador
//       //   console.error(`Error en Auditoría: ${error.message}`);
//       //   throw error;
//       // }),
//     );
//   }
// }

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
import { CreateAuditLogsDto } from 'src/auditLogs/dto/create-auditLogs.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto, ResponseUserDto } from 'src/users/dto';
import { AUDIT_METADATA_KEY } from './audit.decorator';

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
    private readonly usersService: UsersService, 
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> { // Observable: como una "promesa mejorada" que puede emitir múltiples valores en lugar de solo uno.
    const req = context.switchToHttp().getRequest();
    const user: CreateUserDto = req.user;
    const method: 'POST' | 'PATCH' | 'DELETE' = req.method;
    const entity = context.getClass().name;
    const entityId: string = req.params.id;
    const action = this.getAction(method);

    console.log(method)
    console.log(entity)
    console.log(entityId)

    const isAuditEnabled = this.reflector.get<boolean>(
      AUDIT_METADATA_KEY,
      context.getHandler(),
    );

    if (!isAuditEnabled) {
      return next.handle(); // next.handle(): continua con la ejecucion del programa
    }

    // Si la acción es update o delete, obtenemos el estado previo ANTES de ejecutar el método del controlador
    return from( // from() es para convertir la promesa en un Observable. Observable: como una "promesa mejorada" que puede emitir múltiples valores en lugar de solo uno.
      action === Action.update || action === Action.delete
        ? this.usersService.findOneResponse(entityId)
        : Promise.resolve('Newly generated data'),
    ).pipe( // pipe(): permite encadenar operadores en un Observable
      switchMap((beforeData) => // switchMap() : esperar la consulta antes de llamar a next.handle()
        next.handle().pipe(
          tap(async (result: ResponseUserDto) => {  // tap(): se usa en un pipe() para ejecutar código sin modificar los datos del flujo. Es útil para depuración o para realizar acciones secundarias como registrar datos o llamar a una función.
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
        ),
      ),
    );
  }
}


