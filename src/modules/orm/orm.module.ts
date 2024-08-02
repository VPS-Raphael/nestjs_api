import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../entities/user.entity';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';
import { Order } from 'src/entities/order.entity';
import { Dish } from 'src/entities/dish.entity';
import { Tag } from 'src/entities/tag.entity';
import { Provider } from 'src/entities/provider.entity';
import { UserDish } from 'src/entities/userDish.entity';
dotenv.config();

@Module({
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      dbName: process.env.POSTGRESQL_DB,
      user: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PWD_DECODED,
      host: process.env.POSTGRESQL_HOST,
      port: parseInt(
        process.env.POSTGRESQL_PORT ? process.env.POSTGRESQL_PORT : '5432'
      ),
      entities: ['dist/**/*.entities.js'],
      entitiesTs: ['src/**/*.entites.ts'],
      autoLoadEntities: true,
    }),
    MikroOrmModule.forFeature([User, Order, Dish, Tag, Provider, UserDish]),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
