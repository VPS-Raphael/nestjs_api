import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Tag, TagRepository } from 'src/entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly repo: TagRepository,
    private readonly em: EntityManager
  ) {}

  async createTag(name: string): Promise<Tag> {
    try {
      const tag = this.repo.create({ name });
      await this.em.persistAndFlush(tag);
      return tag;
    } catch (error) {
      console.error('An error occurred while creating a tag: ', error);
      throw error;
    }
  }

  async getAllTags(): Promise<Tag[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error('An error occurred while loading the tags: ', error);
      throw error;
    }
  }
}
