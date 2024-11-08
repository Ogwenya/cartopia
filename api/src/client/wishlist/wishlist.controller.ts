import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CustomerGuard } from 'src/auth/customer.guard';
import { WishlistDto } from './dto/wishlist.dto';

@Controller('wishlist')
@UseGuards(CustomerGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll(@Req() request: Request) {
    const logged_in_user = request['logged_in_user'];
    return this.wishlistService.findAll(logged_in_user.id);
  }

  @Patch()
  update(@Req() request: Request, @Body() wishlistDto: WishlistDto) {
    const logged_in_user = request['logged_in_user'];
    return this.wishlistService.update(wishlistDto, logged_in_user.id);
  }
}
