import { IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Action } from '../enums/action.enums';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { object, string } from 'joi';
import { Types } from 'mongoose';

export class CreateAuditLogsDto {

    @ApiProperty({
      description: 'Mongo Id (unique)',
      type: 'string',
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
    description: 'Executed entity',
    type: string,
    nullable: false, // no puede venir nulo
    example: 'Audit',
  })
  @IsString()
  @IsNotEmpty()
  entityAfected: string;

  @ApiProperty({
    description: 'Id Executed entity',
    type: string,
    nullable: false, // no puede venir nulo
    example: '67a1a6c23504ec3e184cc14b',
  })
  @IsString()
  @IsNotEmpty()
  entityAfectedId: string;

  @ApiProperty({
    description: 'Executed method',
    type: string,
    nullable: false, // no puede venir nulo
    example: 'CREATE',
  })
  @IsString()
  @IsNotEmpty()
  action: Action;

  @ApiProperty({
    description: 'Id Executed user or Registratión for user',
    type: string,
    nullable: true, // no puede venir nulo
    example: '67a1a6c23504ec3e184cc14b || Registración por usuario',
    default: 'Registración por usuario',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    value === undefined ? 'Registración por usuario' : value,
  )
  userIdAction: string | undefined; // Puede ser undefined porque si es un register no hay usuario registrado

  @ApiProperty({
    description: 'Original data or NULL',
    type: object,
    nullable: false, // no puede venir nulo
    example: `{"id":"67c61d27fd44754b9f6a4435","name":"nameTest","lastname":"lastnameTest","email":"test@test.com","roles":["ADMIN"],"isActive":true} || NULL`,
  })
  @IsObject()
  beforeData?: object | string;

  @ApiProperty({
    description: 'Edited data',
    type: object,
    nullable: true, // no puede venir nulo
    example: `{"id":"67c61d27fd44754b9f6a4435","name":"nameTest1","lastname":"lastnameTest1","email":"test1@test.com","roles":["USER"],"isActive":true}`,
  })
  @IsObject()
  @IsNotEmpty()
  afterData?: object;
}
