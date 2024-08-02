import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { DishRepository } from 'src/entities/dish.entity';
import { Order, OrderRepository } from 'src/entities/order.entity';
import { ProviderRepository } from 'src/entities/provider.entity';
import { User, UserRepository } from 'src/entities/user.entity';
import { UserDishRepository } from 'src/entities/userDish.entity';
import { SlackService } from '../slack/slack.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly repo: OrderRepository,
    private readonly providerRepo: ProviderRepository,
    private readonly userRepo: UserRepository,
    private readonly dishRepo: DishRepository,
    private readonly userDishRepo: UserDishRepository,
    private readonly slackService: SlackService,
    private readonly em: EntityManager
  ) {}

  async findActiveOrders(): Promise<Order[] | null> {
    try {
      return await this.repo.find(
        { isActive: true },
        {
          populate: [
            'provider',
            'participants',
            'participants.dishes',
            'participants.dishes.dish.provider',
          ],
        }
      );
    } catch (error) {
      console.error(
        'An error occurred while searching for all active orders: ',
        error
      );
    }
  }

  async findOrder(id: number): Promise<Order | null> {
    try {
      return await this.repo.findOne(
        { id },
        { populate: ['participants.dishes.dish'] }
      );
    } catch (error) {
      console.error('An error occurred while searching for an order: ', error);
    }
  }

  async findActiveOrder(id: number): Promise<Order | null> {
    try {
      return await this.repo.findOne(
        { id, isActive: true },
        { populate: ['provider.name', 'participants.dishes.dish.provider'] }
      );
    } catch (error) {
      console.error(
        'An error occurred while searching for an active order: ',
        error
      );
    }
  }

  async createOrder(orderData, user: User): Promise<Order> {
    try {
      const provider = await this.providerRepo.findOneOrFail({
        id: orderData.provider.id,
      });

      orderData.createdBy = user;

      const order = this.repo.create({ ...orderData, provider });
      order.participants.add(user);
      await this.em.persistAndFlush(order);
      return order;
    } catch (error) {
      console.error('An error occurred while creating an order: ', error);
      throw error;
    }
  }

  async handleOrder(orderData) {
    let orderExists = false;

    const provider = await this.providerRepo.findOneOrFail({
      name: orderData.providerName,
    });

    let order = await this.repo.findOne(
      {
        provider: provider,
        isActive: true,
      },
      { populate: ['participants'] }
    );

    const user = await this.userRepo.findOneOrFail({
      slackId: orderData.slackId,
    });

    const dish = await this.dishRepo.findOneOrFail({ id: orderData.dish.id });

    let userDish = await this.userDishRepo.findOne({
      user: user,
      dish: dish,
    });

    if (!userDish) {
      userDish = this.userDishRepo.create({ user, dish, quantity: 1 });
      user.dishes.add(userDish);
      this.em.persist(userDish);
    } else {
      userDish.quantity++;
    }
    await this.em.flush();

    if (!order) {
      // Create order
      orderData.provider = provider;
      order = await this.repo.populate(
        await this.createOrder(orderData, user),
        ['participants']
      );

      this.em.persistAndFlush(order);
      this.scheduleOrderDeactivation(order.id, order.expiryDate);
    } else {
      orderExists = true;
      // Update order
      if (!order.participants.contains(user)) order.participants.add(user);
      this.em.flush();
    }

    // Load order again to fix population bug
    const o = await this.findOrder(order.id);
    const message = this.slackService.generateOrderMessage(o);

    if (orderExists === true) {
      this.slackService.updateSlackMessage(message, o.timeStamp, user.token);
    } else {
      const timeStamp = await this.slackService.sendSlackMessage(
        message,
        user.token
      );
      order.timeStamp = timeStamp;
      this.em.flush();
    }
  }

  async scheduleOrderDeactivation(orderId: number, expiryDate: Date) {
    const now = new Date();
    const delay = expiryDate.getTime() - now.getTime();

    setTimeout(async () => {
      const order = await this.findActiveOrder(orderId);
      if (order) {
        order.isActive = false;

        const message = this.slackService.generateOrderMessage(order);
        this.slackService.updateSlackMessage(
          message,
          order.timeStamp,
          order.createdBy.token
        );

        for (const participant of order.participants) {
          for (const userDish of participant.dishes.filter(
            (userDish) => userDish.dish.provider.name === order.provider.name
          )) {
            this.em.remove(userDish);
          }
        }

        await this.em.flush();
      }
    }, delay);
  }

  async removeUserDish(data): Promise<Order> {
    const userDish = await this.userDishRepo.findOneOrFail(data.userDishId);
    this.em.remove(userDish);
    await this.em.flush();

    const order = await this.findActiveOrder(data.order.id);

    let cancelOrder = true;
    for (const participant of order.participants) {
      const dishes = participant.dishes.filter(
        (dishes) => dishes.dish.provider.name === order.provider.name
      );
      if (dishes.length > 0) cancelOrder = false;
    }

    if (cancelOrder === true) {
      this.slackService.deleteSlackMessage(order.timeStamp, data.token);
      this.em.remove(order);
      await this.em.flush();
      return null;
    } else {
      const message = this.slackService.generateOrderMessage(order);
      await this.slackService.updateSlackMessage(
        message,
        order.timeStamp,
        data.token
      );
      return order;
    }
  }
}
