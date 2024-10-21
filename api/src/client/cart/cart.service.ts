import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  //################################
  // ########## FIND CART ##########
  //################################
  async find_cart(customer_id: number) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { customer_id },
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
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
      const cart = await this.prisma.cart.findUnique({
        where: { customer_id },
        include: { items: true },
      });

      const cart_item = cart
        ? await this.prisma.cartItem.findUnique({
            where: { cart_id: cart.id, product_id: cartDto.product_id },
          })
        : null;

      switch (cartDto.operation) {
        case 'add':
          cart_item
            ? await this.prisma.cartItem.update({
                where: { id: cart_item.id },
                data: {
                  quantity: cart_item.quantity + 1,
                },
              })
            : await this.prisma.cartItem.create({
                data: {
                  product: { connect: { id: cartDto.product_id } },
                  quantity: 1,
                  cart: {
                    connectOrCreate: {
                      where: { id: cart.id },
                      create: { customer: { connect: { id: customer_id } } },
                    },
                  },
                },
              });

          break;

        case 'remove':
          if (!cart) {
            throw new BadRequestException('Product does not exist in cart.');
          }

          cart_item.quantity === 1
            ? await this.prisma.cartItem.delete({
                where: { id: cart_item.id },
              })
            : await this.prisma.cartItem.update({
                where: { id: cart_item.id },
                data: {
                  quantity: cart_item.quantity - 1,
                },
              });

          break;

        case 'delete':
          await this.prisma.cartItem.delete({
            where: { product_id: cartDto.product_id },
          });
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
}
