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
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomerGuard } from 'src/auth/customer.guard';

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
