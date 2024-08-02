import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Order } from './order.entity';
import { UserDish } from './userDish.entity';
import { Dish } from './dish.entity';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property()
  slackId!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  email!: string;

  @Property()
  token!: string;

  @Property()
  profilePic!: string;

  @OneToMany(() => 'Order', 'createdBy')
  createdOrders = new Collection<Order>(this);

  @OneToMany(() => 'UserDish', 'user')
  dishes = new Collection<UserDish>(this);

  @ManyToMany(() => 'Dish', 'favoritedBy', { owner: true })
  favorites = new Collection<Dish>(this);

  @ManyToMany(() => 'Order', 'participants')
  orders = new Collection<Order>(this);
}

export class UserRepository extends EntityRepository<User> {}
