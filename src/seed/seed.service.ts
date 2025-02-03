import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

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
    await this.deleteData();
    await this.deleteCollections()
    await this.insertUserData();
    return 'SEED EXECUTED';
  }

  // Borra todos los datos de las colecciones
  private async deleteData() {
    await this.usersService.removeAllUsers();
  }

  // Borra las colecciones
  private async deleteCollections() {
    await this.usersService.deleteUsersCollection();
  }

  // Inseta los usuarios hardcodeados
  private async insertUserData() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      this.usersService.create(user);
    });
  }



}

