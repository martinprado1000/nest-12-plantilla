import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateAuditLogsDto } from './dto/create-auditLogs.dto';
import {
  AUDITLOGS_REPOSITORY_INTERFACE,
  AuditLogsRepositoryInterface,
} from './interfaces/auditLogs-repository.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class AuditLogsService {
  private defaultLimit: number;
  constructor(

    private readonly configService: ConfigService,

    @Inject(AUDITLOGS_REPOSITORY_INTERFACE)

    private readonly auditLogsRepository: AuditLogsRepositoryInterface,

  ) {
    this.defaultLimit = configService.get<number>('pagination.defaultLimit', 3);
  }
  //: Promise<CreateAuditLogsDto>
  async create(createAuditLogsDto: CreateAuditLogsDto) {
    const res =  await this.auditLogsRepository.create(createAuditLogsDto);
    return res;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return await this.auditLogsRepository.findAll(limit, offset);
  }

  async findOne(term: string) {
    return await this.auditLogsRepository.findById(term);
  }
}
