import { BadRequestException, Injectable } from '@nestjs/common';
import {
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  endOfDay,
  startOfDay,
  addDays,
  format,
} from 'date-fns';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async sales_overview(first_day_of_month: Date, last_day_of_month: Date) {
    // const dailySalesOverview: { [key: string]: number } = {};
    const dailySalesOverview: { date: string; total: number }[] = [];

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
        total: dailyTotal._sum.amount || 0,
      });

      // dailySalesOverview[format(currentDate, 'do')] =
      //   dailyTotal._sum.amount || 0;
      currentDate = nextDate;
    }

    return dailySalesOverview;
  }

  async most_shipped_location(
    first_day_of_month: Date,
    last_day_of_month: Date,
  ) {
    const shippingLocations: { [key: string]: number } = {};

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

    for (const order of orders_within_the_month) {
      const { county, location } = order['Customer'];
      const locationKey = `${county}-${location}`;

      if (shippingLocations[locationKey]) {
        shippingLocations[locationKey]++;
      } else {
        shippingLocations[locationKey] = 1;
      }
    }

    let mostPopularLocation = { county: '', location: '', orderCount: 0 };
    for (const [locationKey, orderCount] of Object.entries(shippingLocations)) {
      const [county, location] = locationKey.split('-');
      if (orderCount > mostPopularLocation.orderCount) {
        mostPopularLocation = { county, location, orderCount };
      }
    }

    return mostPopularLocation;
  }

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

      const latest_orders = orders_within_the_month.splice(0, 5);

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

      const most_shipped_location = await this.most_shipped_location(
        first_day_of_month,
        last_day_of_month,
      );

      return {
        total_revenue,
        total_orders,
        latest_orders,
        complete_orders,
        sales_overview,
        most_shipped_location,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
