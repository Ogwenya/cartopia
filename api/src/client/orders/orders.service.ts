import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
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
  async findAll() {
    try {
      return `This action returns all orders`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //#################################
  // ########## FIND ORDER ##########
  //#################################
  async findOne(id: number) {
    try {
      return `This action returns a #${id} order`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
