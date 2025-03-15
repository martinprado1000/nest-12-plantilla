import {
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Document as DocumentMongoose, isValidObjectId, Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepositoryInterface } from './interfaces/users-repository.interface';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // -----------FIND ALL---------------------------------------------------------------------------------
  async findAll(limit: number, offset: number): Promise<User[]> {
    return await this.userModel
      .find()
      .skip(offset) // Salta los primeros `offset` registros
      .limit(limit);
  }

  // -----------FIND BY ID-------------------------------------------------------------------------------
  async findById(id: string): Promise<DocumentMongoose | null> {
    return await this.userModel.findById(id).lean() ;
  }

  // -----------FIND BY EMAIL-------------------------------------------------------------------------------
  async findeByEmail(email: string): Promise<DocumentMongoose | null> {
    return await this.userModel.findOne({ email }).lean();
  }

  // -----------CREATE------------------------------------------------------------------------------------
  async create(createUserDto: CreateUserDto): Promise<User> {
    return (await this.userModel.create(createUserDto));
  }

  // -----------UPDATE-------------------------------------------------------------------------------
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true, // new:true : retorna el nuevo valor ya editado.
    });
  }

  // -----------DELETE-------------------------------------------------------------------------------
  async delete(id: string): Promise<DocumentMongoose | null> {
    return await this.userModel.findByIdAndDelete(id);
  }

  // -----------DELETE ALL USERS-------------------------------------------------------------------------------
  // Elimina todos los usuarios para poder eliminar la coleccion.
  async deleteAllUsers() {
    await this.userModel.deleteMany();
  }
  // -----------DELETE COLLECTION USERS-------------------------------------------------------------------------------
  // Elimina la colleción users.
  async deleteUsersCollection() {
    await this.userModel.collection.drop();
  }
}
