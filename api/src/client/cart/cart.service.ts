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
        include: { items: true },
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
  async update_cart(customer_id: number, createCartDto: CartDto) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { customer_id },
        include: { items: true },
      });

      if (!cart) {
        if (createCartDto.operation === 'remove') {
          throw new BadRequestException('Product does not exist in cart.');
        }

        await this.prisma.cartItem.create({
          data: {
            product: { connect: { id: createCartDto.product_id } },
            quantity: 1,
            cart: {
              create: {
                customer: { connect: { id: customer_id } },
              },
            },
          },
        });
      } else {
        const cart_item = await this.prisma.cartItem.findUnique({
          where: { cart_id: cart.id, product_id: createCartDto.product_id },
        });

        if (createCartDto.operation === 'remove') {
          if (cart_item.quantity === 1) {
            await this.prisma.cartItem.delete({
              where: { id: cart_item.id },
            });
          } else {
            await this.prisma.cartItem.update({
              where: { id: cart_item.id },
              data: {
                quantity: cart_item.quantity - 1,
              },
            });
          }
        } else {
          if (!cart_item) {
            await this.prisma.cartItem.create({
              data: {
                product: { connect: { id: createCartDto.product_id } },
                quantity: 1,
                cart: { connect: { id: cart.id } },
              },
            });
          } else {
            await this.prisma.cartItem.update({
              where: { id: cart_item.id },
              data: {
                quantity: cart_item.quantity + 1,
              },
            });
          }
        }
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
