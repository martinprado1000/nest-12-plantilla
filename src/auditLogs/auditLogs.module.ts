import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogs, AuditLogsSchema } from './schema/auditLogs.schema';
import { AuditLogsService } from './auditLogs.service';
import { AuditLogsController } from './auditLogs.controller';
import { USERS_REPOSITORY_INTERFACE } from 'src/users/interfaces/users-repository.interface';
import { AuditLogsRepository } from './auditLogs.repository';
import { ConfigModule } from '@nestjs/config';

@Module({

  controllers: [AuditLogsController],

  providers: [
    AuditLogsService,
    AuditLogsRepository, // Inyectamos la dependencia del repositorio indicandole que clase usar cuando llame a la interface USERS_REPOSITORY
    {
      provide: USERS_REPOSITORY_INTERFACE,
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
