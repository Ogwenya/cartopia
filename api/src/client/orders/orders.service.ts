import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

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
      const orders = await this.orderRepository.find({
        where: { customer: { id: customer_id } },
        relations: ['items', 'items.product', 'items.product.images'],
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
      const order = await this.orderRepository.findOne({
        where: { order_number },
        relations: [
          'shippingAddress',
          'transaction_details',
          'items',
          'items.product',
          'items.product.images',
        ],
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
