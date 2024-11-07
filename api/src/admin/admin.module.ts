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
import { DatabaseModule } from 'src/database/database.module';
import { OrdersModule } from './orders/orders.module';
import { TransactionsModule } from './transactions/transactions.module';

const modules = [
  BrandsModule,
  CampaignImagesModule,
  CategoriesModule,
  ProductsModule,
  ShipmentModule,
  UsersModule,
  OrdersModule,
  TransactionsModule,
];

@Module({
  imports: [
    DatabaseModule,
    ...modules,
    RouterModule.register(
      modules.map((module) => {
        return { path: 'admin', module };
      }),
    ),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [DatabaseModule],
})
export class AdminModule {}
