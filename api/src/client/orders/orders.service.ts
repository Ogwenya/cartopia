import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { AddressesService } from '../addresses/addresses.service';
import { Product } from 'src/database/entities/product.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { PaystackService } from 'src/shared/paystack/paystack.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly addressesService: AddressesService,
    private readonly paystackService: PaystackService,
    private readonly usersService: UsersService,
  ) {}

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

  //##########################################
  // ########## UPDATE ORDER STATUS ##########
  //##########################################
  async update_status(
    customer_id: number,
    order_number: string,
    status: string,
  ) {
    try {
      const order = await this.findOne(customer_id, order_number);

      if (
        status === OrderStatus.CANCELED &&
        order.status !== OrderStatus.PROCESSING
      ) {
        throw new NotAcceptableException(
          'You cannot cancel an order whose status is not PROCESSING',
        );
      }

      if (
        status === OrderStatus.COMPLETED &&
        order.status !== OrderStatus.SHIPPED
      ) {
        throw new NotAcceptableException(
          'You cannot confirm an order which has not been SHIPPED',
        );
      }

      await this.orderRepository.update(
        { order_number },
        { status: OrderStatus[status] },
      );

      return { message: `Order successfully ${status}` };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
