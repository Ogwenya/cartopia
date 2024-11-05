import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';
import { AddressesModule } from '../addresses/addresses.module';
import { PaystackService } from 'src/shared/paystack/paystack.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AddressesModule, CartModule, UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService, PaystackService],
})
export class OrdersModule {}
