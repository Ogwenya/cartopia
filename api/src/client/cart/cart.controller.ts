import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CustomerGuard } from 'src/auth/customer.guard';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(CustomerGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  find_cart(@Req() request: Request) {
    const logged_in_user = request['logged_in_user'];
    return this.cartService.find_cart(logged_in_user.id);
  }

  @Get('checkout')
  checkout(@Req() request: Request) {
    const logged_in_user = request['logged_in_user'];
    return this.cartService.checkout(logged_in_user.id);
  }

  @Patch()
  update_cart(@Req() request: Request, @Body() cartDto: CartDto) {
    const logged_in_user = request['logged_in_user'];
    return this.cartService.update_cart(logged_in_user.id, cartDto);
  }
}
