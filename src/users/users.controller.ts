import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
// Cree un punto de entrada en la carpeta dto (index.ts) para poder hacer la importacion solo en una linea como a continuacion:
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from './dto';
// import { Auth } from '/auth/decorators/user.decorator';
// import { RequestAuthDto } from 'src/auth/dto/request-auth.dto';
// import { Role } from 'src/common/enums/role.enums';
// import { ActivateUser } from '../common/decorators/activeUser.decorator';
import { CustomLoggerService } from 'src/logger/logger.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { idMongoPipe } from '../common/pipes/idMongo.pipe';

@Controller('users')
export class UsersController {
  private defaultLimit: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    // this.logger.error('This is an error', UsersController.name, "Error detail");
    // this.logger.warn('This is a warning', UsersController.name);
    // this.logger.log('This is an info log', UsersController.name);
    // this.logger.debug('This is a debug',  UsersController.name);
    // this.logger.verbose('This is a verbose',  UsersController.name);
    return this.usersService.findAllResponse(paginationDto);
  }

  @Get(':term') // term: termino de busqueda porquelo voy a buscar por nombre o id
  async findOne(@Param('term') term: string) {
    return await this.usersService.findOneResponse(term);
  }

  @Post()
  async create(
    // @ActivateUser() user: RequestAuthDto,, con este decorador obtengo el usuario en esta en el request. El usuario en el request se inyecta en el login
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id', idMongoPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204) // Si retorno un codigo 204 por mas que haga un return no retorna nada, si retorna las excepciones.
  async remove(@Param('id', idMongoPipe) id: string) {
    return await this.usersService.remove(id);
  }
}
