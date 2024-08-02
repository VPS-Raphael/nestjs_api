import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Get('callback')
  async slackCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const userData = await this.slackService.handleSlackCallback(code);
      res.json({ userData });
    } catch (error) {
      res.status(500).send('Authentication failed: ' + error.message);
    }
  }
}
