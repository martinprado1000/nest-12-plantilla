import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogs, AuditLogsSchema } from './schema/auditLogs.schema';
import { AuditLogsService } from './auditLogs.service';
import { AuditLogsController } from './auditLogs.controller';
import { AuditLogsRepository } from './auditLogs.repository';
import { ConfigModule } from '@nestjs/config';
import { AUDITLOGS_REPOSITORY_INTERFACE } from './interfaces/auditLogs-repository.interface';

@Module({

  controllers: [AuditLogsController],

  providers: [
    AuditLogsService,
    {  // Inyectamos la dependencia del repositorio indicandole que clase usar cuando llame a la interface USERS_REPOSITORY
      provide: AUDITLOGS_REPOSITORY_INTERFACE,
      useClass: AuditLogsRepository,
    },
  ],

  imports: [
    MongooseModule.forFeature([
      { name: AuditLogs.name, schema: AuditLogsSchema },
    ]),
    ConfigModule,
  ],
  
  exports: [AuditLogsService], 
})
export class AuditLogsModule {}
