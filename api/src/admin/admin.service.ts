import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { Order, OrderStatus } from 'src/database/entities/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // ####################################
  // ########## SALES OVERVIEW ##########
  // ####################################
  async sales_overview(first_day_of_month: Date, last_day_of_month: Date) {
    const dailySales = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.created_at)', 'date')
      .addSelect('SUM(order.amount)', 'amount')
      .where(
        'order.created_at BETWEEN :first_day_of_month AND :last_day_of_month',
        { first_day_of_month, last_day_of_month },
      )
      .groupBy('DATE(order.created_at)')
      .orderBy('DATE(order.created_at)', 'ASC')
      .getRawMany();

    return dailySales.map((sale) => ({
      date: format(sale.date, 'do'),
      amount: parseFloat(sale.amount || 0),
    }));
  }

  // ##################################
  // ########## GET OVERVIEW ##########
  // ##################################
  async get_overview(query: Object) {
    try {
      const selected_period = new Date(query['date']) || new Date();

      const first_day_of_month = startOfMonth(selected_period);
      const last_day_of_month = endOfMonth(selected_period);

      const orders_within_the_month = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.customer', 'customer')
        .where(
          'order.created_at BETWEEN :first_day_of_month AND :last_day_of_month',
          { first_day_of_month, last_day_of_month },
        )
        .orderBy('order.created_at', 'DESC')
        .getMany();

      let total_revenue = 0;
      for (const order of orders_within_the_month) {
        total_revenue += order.status === 'COMPLETED' ? order.amount : 0;
      }

      const sales_overview = await this.sales_overview(
        first_day_of_month,
        last_day_of_month,
      );

      const total_orders = orders_within_the_month.length;

      const latest_orders = orders_within_the_month.splice(0, 8);

      const complete_orders = await this.orderRepository
        .createQueryBuilder('order')
        .where(
          'order.created_at BETWEEN :first_day_of_month AND :last_day_of_month',
          { first_day_of_month, last_day_of_month },
        )
        .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
        .getCount();

      const cancelled_orders = await this.orderRepository
        .createQueryBuilder('order')
        .where(
          'order.created_at BETWEEN :first_day_of_month AND :last_day_of_month',
          { first_day_of_month, last_day_of_month },
        )
        .andWhere('order.status = :status', { status: OrderStatus.CANCELED })
        .getCount();

      return {
        total_revenue,
        total_orders,
        latest_orders,
        complete_orders,
        cancelled_orders,
        sales_overview,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
