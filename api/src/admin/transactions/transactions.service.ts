import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Transaction } from 'src/database/entities/transaction.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Order } from 'src/database/entities/order.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    // private readonly paystackService: PaystackService,
  ) {}

  // fix transactions with null orders
  @Cron(CronExpression.EVERY_30_SECONDS)
  async attach_transaction_to_order() {
    console.log('testing...');
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.order', 'order')
      .where('order.id IS NULL')
      .getMany();

    console.log(transactions);

    for (const transaction of transactions) {
      const order = await this.orderRepository.findOneBy({
        transaction_reference: transaction.reference,
      });

      console.log(order);

      // await this.transactionRepository.update(
      //   { id: transaction.id },
      //   { order },
      // );
    }
  }

  //############################################
  // ########## FIND ALL TRANSACTIONS ##########
  //############################################
  async findAll() {
    try {
      const transactions = await this.transactionRepository.find({
        relations: ['order', 'order.customer'],
        order: { transaction_time: 'DESC' },
      });

      return transactions;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //################################################
  // ########## FIND SPECIFIC TRANSACTION ##########
  //################################################
  async findOne(id: number) {
    try {
      return `This action returns a #${id} transaction`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
