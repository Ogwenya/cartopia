import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { CampaignImagesModule } from './campaign-images/campaign-images.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

const modules = [
  ProductsModule,
  UsersModule,
  BrandsModule,
  CategoriesModule,
  CampaignImagesModule,
  CartModule,
];

@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => {
        return { path: 'client', module };
      }),
    ),
    OrdersModule,
  ],
})
export class ClientModule {}
