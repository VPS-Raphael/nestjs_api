import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Provider } from './provider.entity';

@Entity({ repository: () => OrderRepository })
export class Order extends BaseEntity {
  @Property()
  isActive: boolean = true;

  @Property()
  expiryDate!: Date;

  @Property()
  deliveryMethod!: string;

  @Property()
  timeStamp: string = '';

  @ManyToOne(() => 'User', 'createdOrders')
  createdBy!: User;

  @ManyToOne(() => 'Provider', 'orders')
  provider!: Provider;

  @ManyToMany(() => 'User', 'orders', { owner: true })
  participants = new Collection<User>(this);
}

export class OrderRepository extends EntityRepository<Order> {}
