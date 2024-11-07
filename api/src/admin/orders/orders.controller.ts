import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AllAdminsGuard } from 'src/auth/all-admins.guard';

@Controller('orders')
@UseGuards(AllAdminsGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':order_number')
  findOne(@Param('order_number') order_number: string) {
    return this.ordersService.findOne(order_number);
  }

  @Patch(':order_number')
  update(
    @Param('order_number') order_number: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(order_number, updateOrderDto);
  }

  @Delete(':order_number')
  remove(@Param('order_number') order_number: string) {
    return this.ordersService.remove(order_number);
  }
}
