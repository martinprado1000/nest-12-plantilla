import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
  Matches,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../enums/role.enums';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class CreateUserDto {
  @IsOptional() // 🔹 No siempre estará presente
  @IsMongoId() // 🔹 Valida que sea un ID de Mongo
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? value.toString() : value,
  ) // 🔹 Convierte a string si es un ObjectId, se hace para evitar problemas futuros.
  _id?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[^\s]+$/, { message: 'The name must not contain spaces' })
  @Transform(({ value }) => capitalize(value))
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[^\s]+$/, { message: 'The lastname must not contain spaces' })
  @Transform(({ value }) => capitalize(value))
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  //@Matches(/^[^\s]+$/, { message: 'The password must not contain spaces' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, minúscula y un número.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  //@Matches(/^[^\s]+$/, { message: 'The confirm password must not contain spaces' }) // Esta permite 123456
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La confirmación de contraseña debe tener una letra mayúscula, minúscula y un número.',
  })
  confirmPassword: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  @Transform(({ value }) => {
    if (!value) return undefined; // Si no hay valor, retorna undefined (evita errores)
    if (typeof value === 'string') {
      return [value.toUpperCase()]; // Convierte un string en un array con mayúsculas
    }
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v.toUpperCase() : v)); // Convierte cada string dentro del array a mayúsculas
    }
    return value; // Si es otro tipo de dato, lo deja igual (para validaciones posteriores)
  })
  roles?: Role[] | Role;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
