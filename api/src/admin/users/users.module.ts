import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileService } from 'src/shared/profile/profile.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ProfileService],
})
export class UsersModule {}
