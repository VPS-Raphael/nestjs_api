import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':name')
  async getProviders(@Param('name') name: string, @Res() res: Response) {
    if (name.toLowerCase() === 'alle gerichte')
      return await this.productsService.getAllProviders();
    return await this.productsService.getProvider(name);
  }
}
