import { forwardRef, Module } from '@nestjs/common';
import { ResolveEntityService } from './resolve-entity.service';
import { UsersModule } from 'src/users/users.module';
import { TestModule } from 'src/test/test.module';

@Module({
  providers: [ResolveEntityService],
  imports: [
    forwardRef(() => UsersModule), 
    forwardRef(() => TestModule), 
  ],
  exports: [ResolveEntityService],
})
export class ResolveEntityModule {}
