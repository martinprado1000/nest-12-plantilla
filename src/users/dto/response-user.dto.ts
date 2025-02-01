import { Exclude, Expose, Transform } from 'class-transformer';
import { Role } from '../enums/role.enums';
import { IsOptional } from 'class-validator';

export class ResponseUserDto {

  @Expose()
  @Transform(({ obj }) => obj._id.toString()) // Transforma `_id` a `id` como string
  id: string;

  @Expose()
  name: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  roles: Role;

  @Expose()
  isActive: boolean;

}
