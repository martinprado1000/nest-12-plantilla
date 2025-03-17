import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { TestService } from './test.service';
import { TestInterceptor1, TestInterceptor2, TestInterceptor3 } from './decorators/test.interceptor';
import { TestDecorator } from './decorators/test.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';
import { AuditInterceptor } from 'src/auditLogs/decorators/audit.interceptor';
import { Audit } from 'src/auditLogs/decorators/audit.decorator';


@Controller('test')
@Auth(ValidRoles.SUPERADMIN, ValidRoles.ADMIN)
export class TestController {

  constructor(private readonly testService: TestService) {}

  @UseInterceptors(TestInterceptor1)
  @Get('1')
  findAll() {
    console.log("Segundo: Lo segundo que se ejecuta es lo del controlador y servicio, Este es el controlador")
    return this.testService.findAll();
  }

  @UseInterceptors(TestInterceptor2)
  @Get('2')
  findAll2() {
    console.log("Segundo: Lo segundo que se ejecuta es lo del controlador y servicio, Este es el controlador")
    return this.testService.findAll();
  }

  @UseInterceptors(TestInterceptor3)
  @Patch('3/:id')
  update(@Param('id') id: string) {
    return this.testService.update();
  }
  
  @UseInterceptors(AuditInterceptor)
  @Audit()
  @Delete('4/:id')
  remove(@Param('id') id: string) {
    return this.testService.remove(id);
  }

  @TestDecorator()
  @UseInterceptors(AuditInterceptor)
  @Audit()
  @Get('5/:id')
  findOneResponse(@Param('id') id: string) {
    //return this.testService.findOneResponse(id);
  }

}
