import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Provider } from 'src/entities/provider.entity';
import { ProductsController } from './products.controller';
import { ProviderService } from '../provider/provider.service';
import { ProductsService } from './products.service';

@Module({
  imports: [MikroOrmModule.forFeature([Provider])],
  controllers: [ProductsController],
  providers: [ProductsService, ProviderService],
})
export class ProductsModule {}
