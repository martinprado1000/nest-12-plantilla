import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';

// Decorador para unir los decoradores que necesitemos
export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    RoleProtected(...roles),
    UseGuards( AuthGuard(), UserRoleGuard ),
  );

}