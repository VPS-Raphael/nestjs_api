import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../entities/user.entity';
import { Order } from 'src/entities/order.entity';
import { Dish } from 'src/entities/dish.entity';
import { Tag } from 'src/entities/tag.entity';
import { Provider } from 'src/entities/provider.entity';
import { UserDish } from 'src/entities/userDish.entity';
import { UserModule } from '../user/user.module';
import { DishModule } from '../dish/dish.module';
import { TagModule } from '../tag/tag.module';
import { ProviderModule } from '../provider/provider.module';
import { UserDishModule } from '../userDish/userDish.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Order, Dish, Tag, Provider, UserDish]),
    UserModule,
    DishModule,
    TagModule,
    ProviderModule,
    UserDishModule,
  ],
  controllers: [SlackController],
  providers: [SlackService, UserService],
})
export class SlackModule {}
