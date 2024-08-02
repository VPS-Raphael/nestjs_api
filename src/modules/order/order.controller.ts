import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserDishService } from '../userDish/userDish.service';
import { Order } from 'src/entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly em: EntityManager
  ) {}

  @Post()
  async order(@Body() body) {
    const orderData = body.orderData;

    if (!orderData) {
      throw new BadRequestException('Invalid data');
    }

    try {
      await this.orderService.handleOrder(orderData);
    } catch (error) {
      console.error('An error occurred while processing the order: ', error);
      throw error;
    }
  }

  @Post('delete/userdish')
  async removeUserDish(@Body() body): Promise<Order> {
    const order = this.orderService.removeUserDish(body.data);
    return order;
  }

  @Get('active')
  async getActiveOrders(@Res() response) {
    try {
      const activeOrders = await this.orderService.findActiveOrders();
      return response.status(HttpStatus.OK).json(activeOrders);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while fetching active orders',
        error: error.message,
      });
    }
  }
}
