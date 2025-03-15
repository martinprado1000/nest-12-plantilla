import { Module } from '@nestjs/common';
import { ResolveEntityService } from './resolve-entity.service';
import { UsersModule } from 'src/users/users.module';
import { TestModule } from 'src/test/test.module';

@Module({
  providers: [ResolveEntityService],
  imports: [UsersModule, TestModule],
  exports: [ResolveEntityService], // 👈 Exportamos el servicio
})
export class ResolveEntityModule {}
