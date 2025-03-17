import { forwardRef, Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { AuditLogsModule } from 'src/auditLogs/auditLogs.module';
import { UsersModule } from 'src/users/users.module';
import { ResolveEntityModule } from 'src/resolve-entity/resolve-entity.module';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    // Como el interctor depende de ResolveEntityModule, UsersModule y de CustomLoggerService tengo que importarlos con forwardRef para no generar dependencia circular.
    forwardRef(() => ResolveEntityModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    LoggerModule,
    AuditLogsModule, 
  ],
  exports: [TestService],
})
export class TestModule {}
