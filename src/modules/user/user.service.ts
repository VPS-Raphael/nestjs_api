import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Dish, DishRepository } from 'src/entities/dish.entity';
import { User, UserRepository } from 'src/entities/user.entity';
import { UserDishRepository } from 'src/entities/userDish.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: UserRepository,
    private readonly userDishRepo: UserDishRepository,
    private readonly dishRepo: DishRepository,
    private readonly em: EntityManager
  ) {}

  async findUser(slackId: string): Promise<User | null> {
    try {
      return await this.repo.findOne({ slackId });
    } catch (error) {
      console.error('An error occurred while searching for a user: ', error);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repo.create(userData);
      await this.em.persistAndFlush(user);
      return user;
    } catch (error) {
      console.error('An error occurred while creating a user: ', error);
      throw error;
    }
  }

  async toggleFavorite(slackId: string, dishId: number) {
    try {
      const user = await this.repo.findOneOrFail(
        { slackId: slackId },
        { populate: ['favorites'] }
      );
      const dish = await this.dishRepo.findOneOrFail({ id: dishId });

      if (user.favorites.contains(dish)) user.favorites.remove(dish);
      else user.favorites.add(dish);
      this.em.flush();
    } catch (error) {
      console.error('An error occurred while toggling a favorite: ', error);
    }
  }

  async getFavorites(slackId: string) {
    try {
      const user = await this.repo.findOneOrFail(
        { slackId: slackId },
        { populate: ['favorites'] }
      );
      return user.favorites;
    } catch (error) {
      console.error('An error occurred while toggling a favorite: ', error);
    }
  }
}
