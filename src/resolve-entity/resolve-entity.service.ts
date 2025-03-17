import { Injectable, NotFoundException } from '@nestjs/common';
import { TestService } from 'src/test/test.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ResolveEntityService {
  private entityServices: { [key: string]: any };

  constructor(
    private readonly usersService: UsersService,
    private readonly testService: TestService,
  ) {
    // Mapa que asocia entidades con sus respectivos servicios
    this.entityServices = {
      UsersController: this.usersService,
      TestController: this.testService,
    };
  }

  async findOneResponse(entity: string, id: string): Promise<any> {
    const service = this.entityServices[entity];

    if (!service || !service.findOneResponse) {
      throw new NotFoundException(`No se encontró el servicio para la entidad: ${entity}`);
    }

    return service.findOneResponse(id);
  }
}
