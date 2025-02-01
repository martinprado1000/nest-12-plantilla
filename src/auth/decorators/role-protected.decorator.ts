import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const META_ROLES = 'roles';

// Decoradores de metodos o globales: Obtiene los valores obtenidos por argumento y los agrega a la metadata.
// Este decorador es el que obtiene los roles permitodos que luego seran evaluados por los guards, en este caso el user-role.guard
export const RoleProtected = (...args: ValidRoles[] ) => {

    return SetMetadata( META_ROLES , args);
}