import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';

const modules = [BrandsModule, CategoriesModule, UsersModule];

@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => {
        return { path: 'admin', module };
      }),
    ),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
