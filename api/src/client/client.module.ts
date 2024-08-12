import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';

const modules = [UsersModule];

@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => {
        return { path: 'client', module };
      }),
    ),
  ],
})
export class ClientModule {}
