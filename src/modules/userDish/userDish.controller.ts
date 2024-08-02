import { Controller } from '@nestjs/common';
import { UserDishService } from './userDish.service';

@Controller('userDish')
export class UserDishController {
  constructor(private readonly userDishService: UserDishService) {}
}
