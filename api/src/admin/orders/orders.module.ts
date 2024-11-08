import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaystackService } from 'src/shared/paystack/paystack.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PaystackService],
})
export class OrdersModule {}