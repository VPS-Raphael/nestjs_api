import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Tag } from './tag.entity';
import { UserDish } from './userDish.entity';
import { Provider } from './provider.entity';
import { User } from './user.entity';

@Entity({ repository: () => DishRepository })
export class Dish extends BaseEntity {
  [EntityRepositoryType]?: DishRepository;

  @Property()
  name!: string;

  @Property()
  price!: string;

  @Property()
  description!: string;

  @Property({ type: 'date', nullable: true })
  from?: Date;

  @Property({ type: 'date', nullable: true })
  to?: Date;

  @Property()
  image!: string;

  @ManyToOne(() => 'Provider')
  provider!: Provider;

  @OneToMany(() => 'UserDish', 'dish')
  orderedBy = new Collection<UserDish>(this);

  @ManyToMany(() => 'User', 'favorites')
  favoritedBy = new Collection<User>(this);

  @ManyToMany(() => 'Tag', 'dishes', { owner: true })
  tags = new Collection<Tag>(this);
}

export class DishRepository extends EntityRepository<Dish> {}
