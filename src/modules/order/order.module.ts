import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserDishModule } from '../userDish/userDish.module';
import { SlackModule } from '../slack/slack.module';
import { UserModule } from '../user/user.module';
import { DishModule } from '../dish/dish.module';
import { SlackService } from '../slack/slack.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [OrmModule, UserDishModule, SlackModule, UserModule, DishModule],
  controllers: [OrderController],
  providers: [OrderService, SlackService, UserService],
})
export class OrderModule {}
