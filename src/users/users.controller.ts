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
import { ApiResponse } from '@nestjs/swagger';

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
  //Swagger: @ApiResponse: respuestas posible
  @ApiResponse({ status: 200, description: 'Users list', type: User }) // Type es lo que retorna
  @ApiResponse({ status: 400, description: 'Bad request' })
  findAll(@Query() paginationDto: PaginationDto) {
    // this.logger.error('This is an error', UsersService.name, 'Error detail');
    // this.logger.warn('This is a warning', UsersService.name, 'Warn detail');
    // this.logger.log('This is an info log', UsersService.name, 'Log detail');
    // this.logger.http(`This is an http log', UsersService.name, 'Http detail');
    // this.logger.verbose('This is a verbose', UsersService.name, 'Verbose detail');
    // this.logger.debug('This is a debug', UsersService.name, 'Debug detail');
    // this.logger.silly('This is a debug', UsersService.name, 'Silly detail');
    return this.usersService.findAllResponse(paginationDto);
  }

  @Get(':term') // term: termino de busqueda porquelo voy a buscar por nombre o id
  @ApiResponse({ status: 200, description: 'Users list by term', type: User }) // Type es lo que retorna
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(@Param('term') term: string) {
    return await this.usersService.findOneResponse(term);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'User was created', type: User }) // Type es lo que retorna
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden, token related' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth(ValidRoles.SUPERADMIN)
  async create(
    @Body() createUserDto: CreateUserDto,
    //@GetUser() user: User
  ) {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User was updated', type: User }) // Type es lo que retorna
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 403, description: 'Forbidden, token related' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth(ValidRoles.SUPERADMIN)
  async update(
    @Param('id', idMongoPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'User was deleted'}) // Type es lo que retorna
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 403, description: 'Forbidden, token related' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Auth(ValidRoles.SUPERADMIN)
  @HttpCode(204) // Si retorno un codigo 204 por mas que haga un return no retorna nada, si retorna las excepciones.
  async remove(@Param('id', idMongoPipe) id: string, @GetUser() user: User) {
    return await this.usersService.delete(id, user);
  }
}
