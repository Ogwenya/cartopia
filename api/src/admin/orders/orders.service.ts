import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Transaction } from 'src/database/entities/transaction.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  //######################################
  // ########## FIND ALL ORDERS ##########
  //######################################
  async findAll() {
    try {
      const orders = await this.orderRepository.find({
        relations: [
          'items',
          'shippingAddress',
          'shippingAddress.county',
          'shippingAddress.town',
          'shippingAddress.area',
          'transaction_details',
          'customer',
        ],
        order: { created_at: 'DESC' },
      });

      return orders;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //######################################
  // ########## FIND ORDER ORDER ##########
  //######################################
  async findOne(order_number: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { order_number },
        relations: [
          'items',
          'shippingAddress',
          'shippingAddress.county',
          'shippingAddress.town',
          'shippingAddress.area',
          'transaction_details',
          'customer',
        ],
        select: {
          customer: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone_number: true,
          },
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

  //######################################
  // ########## UPDATE ORDER ##########
  //######################################
  async update(order_number: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.findOne(order_number);

      if (updateOrderDto.status === OrderStatus.SHIPPED) {
        await this.orderRepository.update(
          { order_number },
          { status: updateOrderDto.status, shipped_out_date: new Date() },
        );
      } else {
        await this.orderRepository.update(
          { order_number },
          { status: updateOrderDto.status },
        );
      }

      return { message: 'Status updated successfully.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //######################################
  // ########## DELETE ORDER ##########
  //######################################
  async remove(order_number: string) {
    try {
      const order = await this.findOne(order_number);

      await this.orderItemRepository.delete({
        order: { id: order.id },
      });

      await this.orderRepository.remove(order);

      return { message: `Order deleted successfully` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
