import { Module } from '@nestjs/common';
import { OrmModule } from './modules/orm/orm.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { SlackModule } from './modules/slack/slack.module';
import { ProductsModule } from './modules/products/products.module';
import { ProviderModule } from './modules/provider/provider.module';
import { DishModule } from './modules/dish/dish.module';
import { TagModule } from './modules/tag/tag.module';
import { UserDishModule } from './modules/userDish/userDish.module';

@Module({
  imports: [
    OrmModule,
    SlackModule,
    ProductsModule,
    UserModule,
    OrderModule,
    ProviderModule,
    DishModule,
    TagModule,
    UserDishModule,
  ],
})
export class AppModule {}
