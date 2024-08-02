import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Dish, DishRepository } from 'src/entities/dish.entity';
import { TagRepository } from 'src/entities/tag.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private readonly repo: DishRepository,
    private readonly tagRepo: TagRepository,
    private readonly em: EntityManager
  ) {}

  async getAllDishes(): Promise<Dish[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('An error occurred while loading the dishes: ', error);
      throw error;
    }
  }

  async getDish(id: number): Promise<Dish> {
    try {
      return await this.repo.findOneOrFail(id);
    } catch (error) {
      console.error('An error occurred while loading a dish: ', error);
      throw error;
    }
  }

  async createDish(dishData): Promise<Dish> {
    try {
      const dish = this.repo.create(dishData);
      const tag = await this.tagRepo.find({ name: dishData.tagName });
      if (tag) dish.tags.add(tag);
      await this.em.persistAndFlush(dish);
      return dish;
    } catch (error) {
      console.error('An error occurred while creating a dish: ', error);
      throw error;
    }
  }

  async getDishTags(id: number) {
    try {
      const dish = await this.repo.findOneOrFail(id, { populate: ['tags'] });
      return dish.tags;
    } catch (error) {
      console.error('An error occurred while loading the tags: ', error);
      throw error;
    }
  }
}
