import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // SchemaFactory: crea el modelo del schema
import { Document } from 'mongoose';
import { Role } from '../enums/role.enums';
import { ApiProperty } from '@nestjs/swagger';
import { string } from 'joi';

// Entity para base de datos mongoDB

@Schema({
  timestamps: true, 
})
export class User extends Document {

  @ApiProperty({// Swagger: agrega este dato a la respuesta del endpoint
    description: 'User name',
    example: 'Richard',
    required: true
  }) 
  @Prop({ // Esto le indica que es una propiedad del documento
    required: true,
    trim: true,
  })
  name: string;

  @ApiProperty({// Swagger: agrega este dato a la respuesta del endpoint
    description: 'User lastname',
    example: 'Kendy',
    required: true
  }) 
  @Prop({
    required: true,
    trim: true,
  })
  lastname: string;

  @ApiProperty({// Swagger: agrega este dato a la respuesta del endpoint
    description: 'User email',
    example: 'richard@gmail.com',
    uniqueItems: true,
    required: true
  }) 
  @Prop({
    index: true,
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @ApiProperty({// Swagger: agrega este dato a la respuesta del endpoint
    description: 'User password',
    example: 'Test123##',
    required: true
  })
  @Prop({
    required: true,
    trim: true,
  })
  password: string;

  @ApiProperty({// Swagger: agrega este dato a la respuesta del endpoint
    description: 'User role',
    example: ["USER","OPERATOR","ADMIN","SUPERADMIN"],
    enum: Role,
    default: 'USER',
    required: false
  })
  @Prop({
    trim: true,
    default: ["USER"],
    required: true,
  })
  roles: string[];

  @ApiProperty({// Swagger: agrega este dato a la respuesta del endpoint
    description: 'User is active?',
    example: [true,false],
    default: true,
    required: false
  })
  @Prop({
    required: false,
    default: true 
  })
  isActive: boolean
  
}

export const UserSchema = SchemaFactory.createForClass(User); // SchemaFactory.createForClass: esto es lo que crea el modelo con el nombre user.


// Recordar importar el schema en el modulo:
// imports: [
//   MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Le indico al modulo el nombre y el esquema que va a usar 
// ],