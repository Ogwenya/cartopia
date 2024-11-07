import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { differenceInMinutes } from 'date-fns';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Transaction } from 'src/database/entities/transaction.entity';
import { PaystackService } from 'src/shared/paystack/paystack.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly paystackService: PaystackService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async update_order_status() {
    const pending_orders = await this.orderRepository.find({
      where: { status: OrderStatus.PENDING },
    });

    for (const order of pending_orders) {
      const minute_differnce = differenceInMinutes(
        new Date(),
        new Date(order.created_at),
      );
      if (minute_differnce > 5) {
        const transaction_data = await this.paystackService.verify_transaction(
          order.transaction_reference,
        );

        const payment_status = transaction_data.data.status;

        if (payment_status === 'success') {
          const new_transaction = this.transactionRepository.create({
            amount: transaction_data.data.amount / 100,
            reference: transaction_data.data.reference,
            channel: transaction_data.data.channel,
            transaction_time: transaction_data.data.paid_at,
            order,
          });

          await this.transactionRepository.save(new_transaction);

          await this.orderRepository.update(
            { id: order.id },
            {
              status: OrderStatus.PROCESSING,
            },
          );
        } else if (
          payment_status === 'abandoned' ||
          payment_status === 'failed'
        ) {
          await this.orderItemRepository.delete({
            order: { id: order.id },
          });

          await this.orderRepository.remove(order);
        }
      }
    }
  }

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
