import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';

// Decorador de metodo o global para unir los decoradores que necesitemos
export function Auth(...roles: ValidRoles[]) { // El primer parametro son los datos que nos le pasan a este decorador.

  return applyDecorators( // applyDecorators: Para unis decoradores tengo que retornar applyDecorators con los decoradores deseados.
    RoleProtected(...roles),
    UseGuards( AuthGuard(), UserRoleGuard ),
  );

}