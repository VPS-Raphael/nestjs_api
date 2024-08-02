import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('togglefavorite')
  async toggleFavorite(@Body() body) {
    this.userService.toggleFavorite(body.data.slackId, body.data.dishId);
  }

  @Post('getfavorites')
  async getFavorites(@Body() body) {
    return await this.userService.getFavorites(body.userData.slackId);
  }
}
