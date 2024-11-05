import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Customer } from 'src/database/entities/customer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // #############################################
  // ########## CREATE CUSTOMER ACCOUNT ##########
  // #############################################
  async create_user(createUserDto: CreateUserDto) {
    try {
      const user_exist = await this.customerRepository.findOneBy({
        email: createUserDto.email,
      });

      if (user_exist) {
        throw new BadRequestException(
          'A user with this email is already registered.',
        );
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(createUserDto.password, salt);

      const customer = this.customerRepository.create({
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        email: createUserDto.email,
        password: hashed_password,
      });

      await this.customerRepository.save(customer);

      this.eventEmitter.emit('user.welcome-email', {
        firstname: customer.firstname,
        email: customer.email,
      });

      return { message: 'Account successfully created.' };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  // ##########################################
  // ########## GET CUSTOMER DETAILS ##########
  // ##########################################
  async findOne(id: number) {
    try {
      const customer = await this.customerRepository.findOneBy({ id });

      if (!customer) {
        throw new NotFoundException();
      }

      return customer;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
  // #############################################
  // ########## DELETE CUSTOMER ACCOUNT ##########
  // #############################################
  remove(id: number, logged_in_user) {
    return `This action removes a #${id} user`;
  }
}
