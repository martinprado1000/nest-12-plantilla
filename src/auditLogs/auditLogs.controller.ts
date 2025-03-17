import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuditLogsService } from './auditLogs.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Audit } from 'src/common/decorators/audit.decorator';

@Controller('auditLogs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Audit()
  @ApiResponse({ status: 200, description: 'Check-status OK' }) // Type es lo que retorna
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.auditLogsService.findAll(paginationDto); 
  }

  @Get(':term')
  @ApiResponse({ status: 200, description: 'Check-status OK' }) // Type es lo que retorna
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('term') term: string) {
    return this.auditLogsService.findOne(term);
  }
}
