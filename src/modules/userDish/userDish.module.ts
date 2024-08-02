import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserDish } from 'src/entities/userDish.entity';
import { UserDishService } from './userDish.service';
import { UserDishController } from './userDish.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserDish])],
  controllers: [UserDishController],
  providers: [UserDishService],
})
export class UserDishModule {}
