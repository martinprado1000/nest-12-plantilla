import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // SchemaFactory: crea el modelo del schema
import { Document } from 'mongoose';
import { Role } from '../enums/role.enums';

// Entity para base de datos mongoDB

@Schema({
  timestamps: true, 
})
export class User extends Document {

  @Prop({ // Esto le indica que es una propiedad del documento
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastname: string;

  @Prop({
    index: true,
    required: true,
    unique: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  password: string;

  @Prop({
    required: true,
    trim: true,
    default: ["USER"] 
  })
  roles: string[];

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