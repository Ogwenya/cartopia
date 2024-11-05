import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInMinutes } from 'date-fns';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { AddressesService } from '../addresses/addresses.service';
import { Product } from 'src/database/entities/product.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { PaystackService } from 'src/shared/paystack/paystack.service';
import { UsersService } from '../users/users.service';
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
    private readonly cartService: CartService,
    private readonly addressesService: AddressesService,
    private readonly paystackService: PaystackService,
    private readonly usersService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async update_active_nas_sessions_cache() {
    const pending_orders = await this.orderRepository.find({
      where: { status: OrderStatus.PENDING },
    });

    for (const order of pending_orders) {
      const minute_differnce = differenceInMinutes(
        new Date(),
        new Date(order.created_at),
      );
      if (minute_differnce > 3) {
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

  //############################################
  // ########## GENERATE ORDER NUMBER ##########
  //############################################
  generate_order_number() {
    const date = new Date();
    const order_number =
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2);

    return order_number;
  }

  //#########################################
  // ########## CALCULATE DISCOUNT ##########
  //#########################################
  calculate_discount(product: Product) {
    let discount_amount = 0;

    if (product.discount_type === 'NONE') {
      discount_amount = 0;
    } else if (product.discount_type === 'Amount') {
      discount_amount = product.discount_value;
    } else {
      discount_amount = (product.discount_value / 100) * product.price;
    }
    const after_discount_price = product.price - discount_amount;

    return { discount_amount, after_discount_price };
  }

  //###################################
  // ########## CREATE ORDER ##########
  //###################################
  async create(customer_id: number, createOrderDto: CreateOrderDto) {
    try {
      const customer = await this.usersService.findOne(customer_id);

      const cart = await this.cartService.find_cart(customer_id);

      const shippingAddress = await this.addressesService.findOne(
        customer_id,
        createOrderDto.address_id,
      );

      const amount =
        cart['items'].reduce((totalPrice, item) => {
          const { after_discount_price } = this.calculate_discount(
            item.product,
          );

          return totalPrice + item.quantity * after_discount_price;
        }, 0) || 0;

      const shipment_fee = shippingAddress.area.fees;

      const initialized_transaction =
        await this.paystackService.initialize_transaction(
          customer.email,
          amount + shipment_fee,
        );

      const order = this.orderRepository.create({
        order_number: this.generate_order_number(),
        amount,
        shipment_fee,
        shippingAddress,
        customer,
        transaction_reference: initialized_transaction.data.reference,
      });

      await this.orderRepository.save(order);

      const order_items = cart['items'].map((item: CartItem) => {
        const order_item = new OrderItem();
        order_item.quantity = item.quantity;
        order_item.discount = item.product.discount_value;
        order_item.price = item.product.price;
        order_item.discount_type = item.product.discount_type;
        order_item.product = item.product;
        order_item.order = order;
        order_item.product_name = item.product.name;
        order_item.product_image = item.product.images[0].image_url;
        return order_item;
      });

      await this.orderItemRepository.save(order_items);

      return {
        access_code: initialized_transaction.data.access_code,
        authorization_url: initialized_transaction.data.authorization_url,
      };
    } catch (error) {
      console.log(error);
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
        order: { created_at: 'DESC' },
      });

      return orders;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //#################################
  // ########## FIND ORDER ##########
  //#################################
  async findOne(customer_id: number, order_number: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { order_number, customer: { id: customer_id } },
        relations: [
          'shippingAddress',
          'shippingAddress.county',
          'shippingAddress.town',
          'shippingAddress.area',
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

  //#######################################
  // ########## CONFIRM CHECKOUT ##########
  //#######################################
  async confirm_checkout(customer_id: number, transaction_reference: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { transaction_reference, customer: { id: customer_id } },
        relations: [
          'shippingAddress',
          'shippingAddress.county',
          'shippingAddress.town',
          'shippingAddress.area',
          'transaction_details',
          'items',
          'items.product',
          'items.product.images',
        ],
      });

      if (!order) {
        throw new NotFoundException();
      }

      const cleared_cart = await this.cartService.clear_cart(customer_id);

      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
