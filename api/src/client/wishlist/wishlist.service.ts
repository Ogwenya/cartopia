import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistDto } from './dto/wishlist.dto';
import { Wishlist } from 'src/database/entities/wish-list.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  //############################################
  // ########## GET CUSTOMER WISHLIST ##########
  //############################################
  async findAll(customer_id: number) {
    try {
      const wishlist = await this.wishlistRepository.find({
        where: { customer: { id: customer_id } },
        relations: {
          product: { images: true },
        },
      });
      return wishlist;
    } catch (error) {
      throw new BadRequestException('Error fetching customer wishlist');
    }
  }

  //###############################################
  // ########## UPDATE CUSTOMER WISHLIST ##########
  //###############################################
  async update(wishlistDto: WishlistDto, customer_id: number) {
    try {
      const data = {
        product: { id: wishlistDto.product_id },
        customer: { id: customer_id },
      };
      const product_in_wishlist = await this.wishlistRepository.findOne({
        where: data,
      });

      if (product_in_wishlist) {
        await this.wishlistRepository.remove(product_in_wishlist);
      } else {
        const wishlist_item = this.wishlistRepository.create(data);

        await this.wishlistRepository.save(wishlist_item);
      }

      return { message: 'Wish list successfully updated.' };
    } catch (error) {
      throw new BadRequestException('Error updating product wishlist');
    }
  }
}
