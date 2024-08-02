import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Dish } from './dish.entity';
import { Order } from './order.entity';

@Entity({ repository: () => ProviderRepository })
export class Provider extends BaseEntity {
  [EntityRepositoryType]?: ProviderRepository;

  @Property()
  name!: string;

  @Property()
  image!: string;

  @OneToMany(() => 'Dish', 'provider')
  dishes = new Collection<Dish>(this);

  @OneToMany(() => 'Order', 'provider')
  orders = new Collection<Order>(this);
}

export class ProviderRepository extends EntityRepository<Provider> {}
