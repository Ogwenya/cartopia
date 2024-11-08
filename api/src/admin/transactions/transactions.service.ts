import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/database/entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

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
