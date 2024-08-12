import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create_user(createUserDto: CreateUserDto) {
    try {
      const user_exist = await this.prisma.customer.findUnique({
        where: { email: createUserDto.email },
      });

      if (user_exist) {
        throw new BadRequestException(
          'A user with this email is already registered.',
        );
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(createUserDto.password, salt);

      const user = await this.prisma.customer.create({
        data: {
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          email: createUserDto.email,
          password: hashed_password,
        },
      });

      this.eventEmitter.emit('user.welcome-email', {
        firstname: user.firstname,
        email: user.email,
      });

      return { message: 'Account successfully created.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
