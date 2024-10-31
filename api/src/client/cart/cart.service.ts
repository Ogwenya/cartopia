import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { CartDto } from './dto/cart.dto';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { ShippingAddress } from 'src/database/entities/shipping-address.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ShippingAddress)
    private readonly addressRepository: Repository<ShippingAddress>,
  ) {}

  //################################
  // ########## FIND CART ##########
  //################################
  async find_cart(customer_id: number) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { customer: { id: customer_id } },
        relations: ['items', 'items.product', 'items.product.images'],
      });

      return cart ? cart : {};
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  //##################################
  // ########## UPDATE CART ##########
  //##################################
  async update_cart(customer_id: number, cartDto: CartDto) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { customer: { id: customer_id } },
        relations: ['items', 'items.product', 'items.product.images'],
      });

      const cart_item = cart
        ? await this.cartItemRepository.findOneBy({
            cart: { id: cart.id },
            product: { id: cartDto.product_id },
          })
        : null;

      switch (cartDto.operation) {
        case 'add':
          if (cart_item) {
            await this.cartItemRepository.update(
              { id: cart_item.id },
              { quantity: cart_item.quantity + 1 },
            );
          } else {
            if (cart) {
              const new_item = this.cartItemRepository.create({
                product: { id: cartDto.product_id },
                quantity: 1,
                cart: { id: cart.id },
              });

              await this.cartItemRepository.save(new_item);
            } else {
              const new_cart = this.cartRepository.create({
                customer: { id: customer_id },
              });

              await this.cartRepository.save(new_cart);

              const new_item = this.cartItemRepository.create({
                product: { id: cartDto.product_id },
                quantity: 1,
                cart: new_cart,
              });

              await this.cartItemRepository.save(new_item);
            }
          }

          break;

        case 'remove':
          if (!cart) {
            throw new BadRequestException('Product does not exist in cart.');
          }

          cart_item.quantity === 1
            ? await this.cartItemRepository.remove(cart_item)
            : await this.cartItemRepository.update(
                { id: cart_item.id },
                {
                  quantity: cart_item.quantity - 1,
                },
              );

          break;

        case 'delete':
          await this.cartItemRepository.remove(cart_item);
          break;
      }

      return { message: 'cart updated' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  //########################################
  // ########## GET CHECKOUT DATA ##########
  //########################################
  async checkout(customer_id: number) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { customer: { id: customer_id } },
        relations: ['items', 'items.product', 'items.product.images'],
      });

      const shipping_addresses = await this.addressRepository.find({
        where: {
          customer: { id: customer_id },
        },
      });

      return { cart, shipping_addresses };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
