import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [OrmModule],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
