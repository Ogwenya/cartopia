import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomerGuard } from 'src/auth/customer.guard';
import { OrderStatus } from 'src/database/entities/order.entity';

@Controller('orders')
@UseGuards(CustomerGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() request: Request, @Body() createOrderDto: CreateOrderDto) {
    const logged_in_user = request['logged_in_user'];
    return this.ordersService.create(logged_in_user.id, createOrderDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    const logged_in_user = request['logged_in_user'];
    return this.ordersService.findAll(logged_in_user.id);
  }

  @Patch('cancel/:order_number')
  cancel_order(
    @Req() request: Request,
    @Param('order_number') order_number: string,
  ) {
    const logged_in_user = request['logged_in_user'];
    return this.ordersService.update_status(
      logged_in_user.id,
      order_number,
      OrderStatus.CANCELED,
    );
  }

  @Patch('complete/:order_number')
  complete_order(
    @Req() request: Request,
    @Param('order_number') order_number: string,
  ) {
    const logged_in_user = request['logged_in_user'];
    return this.ordersService.update_status(
      logged_in_user.id,
      order_number,
      OrderStatus.COMPLETED,
    );
  }

  @Get('confirm/:transaction_reference')
  confirm_checkout(
    @Req() request: Request,
    @Param('transaction_reference') transaction_reference: string,
  ) {
    const logged_in_user = request['logged_in_user'];
    return this.ordersService.confirm_checkout(
      logged_in_user.id,
      transaction_reference,
    );
  }

  @Get(':order_number')
  findOne(
    @Req() request: Request,
    @Param('order_number') order_number: string,
  ) {
    const logged_in_user = request['logged_in_user'];
    return this.ordersService.findOne(logged_in_user.id, order_number);
  }
}
