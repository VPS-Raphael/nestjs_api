import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UserDish, UserDishRepository } from 'src/entities/userDish.entity';

@Injectable()
export class UserDishService {
  constructor(
    @InjectRepository(UserDish) private readonly repo: UserDishRepository,
    private readonly em: EntityManager
  ) {}
}
