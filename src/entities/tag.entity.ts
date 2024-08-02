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
import { Dish } from './dish.entity';

@Entity({ repository: () => TagRepository })
export class Tag extends BaseEntity {
  [EntityRepositoryType]?: TagRepository;

  @Property()
  name!: string;

  @ManyToMany(() => 'Dish', 'tags')
  dishes = new Collection<Dish>(this);
}

export class TagRepository extends EntityRepository<Tag> {}
