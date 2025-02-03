import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from 'src/users/schemas/user.schema';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}


  @Get('executeSeed')
  @Auth(ValidRoles.SUPERADMIN)
  executeSeed() {
    return this.seedService.runSeed();
  }

}