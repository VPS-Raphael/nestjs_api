import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { DishService } from './dish.service';
import { Response } from 'express';
import { ProviderService } from '../provider/provider.service';

@Controller('dish')
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly providerService: ProviderService
  ) {}

  @Post('create')
  async create(@Body() body) {
    try {
      const dishData = body.dishData;
      const provider = await this.providerService.findProviderByName(
        dishData.provider.name
      );

      if (!provider) {
        console.error(
          'An error occurred while creating a dish: provider was not found'
        );
        return;
      }

      dishData.provider = provider;
      const dishes = await this.dishService.getAllDishes();

      for (const dish of dishes) {
        if (
          dish.name.toLowerCase() === dishData.name.toLowerCase() &&
          dish.provider.name === dishData.provider.name
        ) {
          return;
        }
      }

      const dish = await this.dishService.createDish(dishData);
      this.providerService.addDish(provider, dish);
    } catch (error) {
      console.error('An error occurred while creating a dish: ', error);
    }
  }

  @Get(':id')
  async getDishTags(@Param('id') id: number, @Res() res: Response) {
    try {
      const tags = await this.dishService.getDishTags(id);
      res.json(tags);
    } catch (error) {
      res
        .status(500)
        .send('An error occurred while loading the tags: ' + error.message);
    }
  }

  @Get('get/:id')
  async getDish(@Param('id') id: number, @Res() res: Response) {
    try {
      const dish = await this.dishService.getDish(id);
      res.json(dish);
    } catch (error) {
      res
        .status(500)
        .send('An error occurred while loading the tags: ' + error.message);
    }
  }
}
