import { BadRequestException, Injectable } from '@nestjs/common';
import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  addDays,
  format,
} from 'date-fns';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ####################################
  // ########## SALES OVERVIEW ##########
  // ####################################
  async sales_overview(first_day_of_month: Date, last_day_of_month: Date) {
    // const dailySalesOverview: { [key: string]: number } = {};
    const dailySalesOverview: { date: string; revenue: number }[] = [];

    let currentDate = startOfDay(first_day_of_month);
    while (currentDate <= last_day_of_month) {
      const nextDate = addDays(currentDate, 1);

      const dailyTotal = await this.prisma.order.aggregate({
        where: {
          AND: [
            { created_at: { gte: currentDate } },
            { created_at: { lt: nextDate } },
          ],
        },
        _sum: {
          amount: true,
        },
      });

      dailySalesOverview.push({
        date: format(currentDate, 'do'),
        revenue: dailyTotal._sum.amount || 0,
      });

      currentDate = nextDate;
    }

    return dailySalesOverview;
  }

  // ##################################
  // ########## GET OVERVIEW ##########
  // ##################################
  async get_overview(query: Object) {
    try {
      const selected_period = new Date(query['date']) || new Date();

      const first_day_of_month = startOfMonth(selected_period);
      const last_day_of_month = endOfMonth(selected_period);

      const orders_within_the_month = await this.prisma.order.findMany({
        where: {
          AND: [
            { created_at: { gte: first_day_of_month } },
            { created_at: { lte: last_day_of_month } },
          ],
        },
        include: {
          customer: true,
        },
        orderBy: { created_at: 'desc' },
      });

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

      const complete_orders = await this.prisma.order.count({
        where: {
          status: 'COMPLETED',
          AND: [
            { created_at: { gte: first_day_of_month } },
            { created_at: { lte: last_day_of_month } },
          ],
        },
        orderBy: { created_at: 'desc' },
      });

      const cancelled_orders = await this.prisma.order.count({
        where: {
          status: 'CANCELED',
          AND: [
            { created_at: { gte: first_day_of_month } },
            { created_at: { lte: last_day_of_month } },
          ],
        },
        orderBy: { created_at: 'desc' },
      });

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
