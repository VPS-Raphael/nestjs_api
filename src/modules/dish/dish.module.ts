import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { ProviderService } from '../provider/provider.service';

@Module({
  imports: [OrmModule],
  controllers: [DishController],
  providers: [DishService, ProviderService],
})
export class DishModule {}
