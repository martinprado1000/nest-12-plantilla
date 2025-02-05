import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
  Matches,
  IsBoolean,
  IsMongoId
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from '../enums/role.enums';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { array, boolean, string } from 'joi';

export class CreateUserDto {

  @ApiProperty({
    description: 'Mongo Id (unique)',
    type: string,
    nullable: true, // True porque viene siempre nulo
    example: "67a1a6c23504ec3e184cc14a",
  })
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? value.toString() : value,
  ) // Convierte a string si es un ObjectId, se hace para evitar problemas futuros.
  _id?: string;

  @ApiProperty({
    description: 'User name',
    type: string,
    minLength: 2,
    nullable: false, // no puede venir nulo
    example: 'Richard'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[^\s]+$/, { message: 'The name must not contain spaces' })
  @Transform(({ value }) => capitalize(value))
  name: string;

  @ApiProperty({
    description: 'User lastname',
    type: string,
    minLength: 2,
    nullable: false,
    example: 'Kendy'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[^\s]+$/, { message: 'The lastname must not contain spaces' })
  @Transform(({ value }) => capitalize(value))
  lastname: string;

  @ApiProperty({
    description: 'User email',
    type: string,
    nullable: false,
    example: 'richard@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'User password',
    type: string,
    nullable: false,
    example: 'Test123##'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  //@Matches(/^[^\s]+$/, { message: 'The password must not contain spaces' })
  @Matches(/^\S*$/, { message: 'La contraseña no debe contener espacios' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, minúscula y un número.',
  })
  password: string;

  @ApiProperty({
    description: 'User confirm password',
    type: string,
    nullable: false,
    example: 'Test123##'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  //@Matches(/^[^\s]+$/, { message: 'The confirm password must not contain spaces' }) // Esta permite 123456
  @Matches(/^\S*$/, {
    message: 'La confirmación de contraseña no debe contener espacios',
  })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La confirmación de contraseña debe tener una letra mayúscula, minúscula y un número.',
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'User role',
    type: array,
    enum: Role,
    nullable: true,
    example: 'USER'
  })
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

  @ApiProperty({
    description: 'User is active?',
    type: boolean,
    nullable: true,
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
