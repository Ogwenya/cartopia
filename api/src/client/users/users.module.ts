import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { ProfileService } from 'src/shared/profile/profile.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ProfileService, PrismaService],
})
export class UsersModule {}
