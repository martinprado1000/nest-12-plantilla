import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { initialData } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class SeedService {
  private readonly passwordSeedUsers:string;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.passwordSeedUsers = configService.get<string>('passwordSeedUsers') as string;
  }

  // Ejecuta la semilla.
  async runSeed() {
    try {
      const deleteData = await this.deleteData();
      console.log(deleteData)
      const deleteCollections = await this.deleteCollections()
      console.log(deleteCollections)
      const insertUserData = await this.insertUserData();
      console.log(insertUserData)
      return 'SEED EXECUTED';
    } catch (error) {
      throw new InternalServerErrorException('Please check server logs');
    }
  }

  // Borra todos los datos de las colecciones
  private async deleteData() {
    return await this.usersService.removeAllUsers();
  }

  // Borra las colecciones
  private async deleteCollections() {
    return await this.usersService.deleteUsersCollection();
  }

  // Inseta los usuarios hardcodeados
  private async insertUserData() {
    const seedUsers = initialData.users;
    //const users: User[] = [];
    seedUsers.forEach((user) => {
      this.usersService.create(user);
    });
    return 'Usuarios creados con éxito';
  }



}

