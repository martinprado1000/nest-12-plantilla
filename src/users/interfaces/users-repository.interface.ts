import { CreateUserDto, UpdateUserDto } from "../dto";
import { User } from "../schemas/user.schema";
import { Document as DocumentMongoose } from 'mongoose';

export const USERS_REPOSITORY_INTERFACE = 'UsersRepositoryInterface';

export interface UsersRepositoryInterface {
    findAll(limit:number, offset:number):Promise<User[]>;
    findById(id: string): Promise<DocumentMongoose | null>;
    findeByEmail(email: string): Promise<DocumentMongoose | null>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
    delete(is:string): Promise<DocumentMongoose | null>;
    deleteAllUsers():void;
    deleteUsersCollection():void;
  }