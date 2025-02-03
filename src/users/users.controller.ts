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
import { Auth, GetUser } from '../auth/decorators';
// import { RequestAuthDto } from 'src/auth/dto/request-auth.dto';
// import { Role } from 'src/common/enums/role.enums';
import { CustomLoggerService } from 'src/logger/logger.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { idMongoPipe } from '../common/pipes/idMongo.pipe';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  private defaultLimit: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  // @Get('removeAllUsers')
  // async removeAllUsers(
  // ) {
  //   return await this.usersService.removeAllUsers();
  // }
  
  // @Get('deleteUsersCollection')
  // async DeleteUsersCollection(
  // ) {
  //   return await this.usersService.deleteUsersCollection();
  // }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    this.logger.error('This is an error', UsersController.name, "Error detail"); // .error recibe un tercer parametro de detalle.
    // this.logger.warn('This is a warning', UsersController.name);
    // this.logger.log('This is an info log', UsersController.name);
    // this.logger.debug('This is a debug',  UsersController.name);
    // this.logger.verbose('This is a verbose',  UsersController.name);
    return this.usersService.findAllResponse(paginationDto);
  }

  @Get(':term') // term: termino de busqueda porquelo voy a buscar por nombre o id
  async findOne(
    @Param('term') term: string
  ) {
    return await this.usersService.findOneResponse(term);
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    //@GetUser() user: User
  ) {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id', idMongoPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.SUPERADMIN)
  @HttpCode(204) // Si retorno un codigo 204 por mas que haga un return no retorna nada, si retorna las excepciones.
  async remove(
    @Param('id', idMongoPipe) id: string, 
    @GetUser() user: User) {
    return await this.usersService.remove(id,user);
  }
}
