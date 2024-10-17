import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ShipmentModule } from './shipment/shipment.module';
import { CampaignImagesModule } from './campaign-images/campaign-images.module';
import { PrismaService } from 'src/prisma.service';

const modules = [
  BrandsModule,
  CampaignImagesModule,
  CategoriesModule,
  ProductsModule,
  ShipmentModule,
  UsersModule,
];

@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => {
        return { path: 'admin', module };
      }),
    ),
  ],
  providers: [AdminService, PrismaService],
  controllers: [AdminController],
})
export class AdminModule {}
