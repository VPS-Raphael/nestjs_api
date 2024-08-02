import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [OrmModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
