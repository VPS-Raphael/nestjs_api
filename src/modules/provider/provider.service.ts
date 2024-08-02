import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Dish } from 'src/entities/dish.entity';
import { Provider, ProviderRepository } from 'src/entities/provider.entity';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider) private readonly repo: ProviderRepository,
    private readonly em: EntityManager
  ) {}

  async getAllProviders(): Promise<Provider[]> {
    try {
      return await this.repo.findAll({ populate: ['dishes'] });
    } catch (error) {
      console.error(
        'An error occurred while searching for the providers: ',
        error
      );
      throw error;
    }
  }

  async findProviderByName(name: string): Promise<Provider | null> {
    try {
      return await this.repo.findOne({ name });
    } catch (error) {
      console.error(
        'An error occurred while searching for a provider: ',
        error
      );
    }
  }

  async findProvider(id: number): Promise<Provider | null> {
    try {
      return await this.repo.findOne({ id });
    } catch (error) {
      console.error(
        'An error occurred while searching for a provider: ',
        error
      );
    }
  }

  async addDish(provider: Provider, dish: Dish) {
    try {
      provider.dishes.add(dish);
      await this.em.flush();
      return provider;
    } catch (error) {
      console.error(
        'An error occurred while adding the dish to the provider: ',
        error
      );
      throw error;
    }
  }

  async createProvider(providerData: Partial<Provider>): Promise<Provider> {
    try {
      const provider = this.repo.create(providerData);
      await this.em.persistAndFlush(provider);
      return provider;
    } catch (error) {
      console.error('An error occurred while creating a provider: ', error);
      throw error;
    }
  }
}
