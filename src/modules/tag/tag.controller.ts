import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  async getAllTags(@Res() res: Response) {
    try {
      const tags = await this.tagService.getAllTags();
      res.json(tags);
    } catch (error) {
      res
        .status(500)
        .send('An error occurred while loading the tags: ' + error.message);
    }
  }

  @Post('create')
  async createTag(@Body() body, @Res() res: Response) {
    try {
      const tags = await this.tagService.getAllTags();
      for (const tag of tags) {
        if (tag.name.toLowerCase() === body.tagName.toLowerCase()) {
          return;
        }
      }
      const tag = await this.tagService.createTag(body.tagName);
    } catch (error) {
      res
        .status(500)
        .send('An error occurred while creating a tag: ' + error.message);
    }
  }
}
