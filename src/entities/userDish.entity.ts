import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { Dish } from './dish.entity';
import { User } from './user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

@Entity({ repository: () => UserDishRepository })
export class UserDish extends BaseEntity {
  [EntityRepositoryType]?: UserDishRepository;

  @ManyToOne(() => 'User')
  user!: User;

  @ManyToOne(() => 'Dish')
  dish!: Dish;

  @Property()
  quantity!: number;
}

export class UserDishRepository extends EntityRepository<UserDish> {}
