import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';

@Module({
  imports: [OrmModule],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
