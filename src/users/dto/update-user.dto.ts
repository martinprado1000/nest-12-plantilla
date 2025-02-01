//import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger'; 
import { CreateUserDto } from './create-user.dto';

// Swager, cambiamos la importacion de PartialType y con eso ya detecta los valores de donde extiende.
// Mestra lo mismo que en el CreateProductDto pero SIN el * porque es opcional 
export class UpdateUserDto extends PartialType(CreateUserDto) {}