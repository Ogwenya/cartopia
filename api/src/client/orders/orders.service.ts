import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  //###################################
  // ########## CREATE ORDER ##########
  //###################################
  async create(customer_id: number, createOrderDto: CreateOrderDto) {
    try {
      return 'This action adds a new order';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //######################################
  // ########## FIND ALL ORDERS ##########
  //######################################
  async findAll(customer_id: number) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { customer_id },
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
      });

      return orders;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //#################################
  // ########## FIND ORDER ##########
  //#################################
  async findOne(order_number: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { order_number },
        include: {
          shippingAddress: true,
          transaction_details: true,
          items: { include: { product: { include: { images: true } } } },
        },
      });

      if (!order) {
        throw new NotFoundException();
      }

      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
