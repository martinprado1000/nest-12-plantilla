import { Document as DocumentMongoose } from 'mongoose';
import { AuditLogs } from '../schema/auditLogs.schema';
import { CreateAuditLogsDto } from '../dto/create-auditLogs.dto';

export const AUDITLOGS_REPOSITORY_INTERFACE = 'AuditLogsRepositoryInterface';

export interface AuditLogsRepositoryInterface {
  create(createAuditLogsDto: CreateAuditLogsDto): Promise<AuditLogs>;
  findAll(limit: number, offset: number): Promise<AuditLogs[]>;
  findById(id: string): Promise<DocumentMongoose | null>;
}
