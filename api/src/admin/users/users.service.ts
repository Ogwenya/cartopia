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

  // generate password
  async generate_password() {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&';
    let password = '';
    for (let i = 0; i < 10; ++i) {
      const randomIndex = Math.floor(Math.random() * charset.length);

      password += charset.charAt(randomIndex);
    }
    return password;
  }

  // *****************
  // CREATE USER
  // *****************
  async create(createUserDto: CreateUserDto) {
    try {
      // check if user already exist in the database
      const user_exist = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (user_exist) {
        throw new BadRequestException(
          'A user with this email is already registered.',
        );
      }

      const generated_password = await this.generate_password();

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(generated_password, salt);

      const user = await this.prisma.user.create({
        data: {
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          email: createUserDto.email,
          password: hashed_password,
          role: createUserDto.role,
        },
      });

      this.eventEmitter.emit('user.send-credentials', {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: generated_password,
      });

      return { message: 'User successfully created.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // GET ALL USERS
  // *****************
  async findAll() {
    try {
      const users = this.prisma.user.findMany({
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // UPDATE USER
  // *****************
  async update_user(id: number, updateUserDto: UpdateUserDto) {
    try {
      // confirm if user exist
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('A user with this id does not exist.');
      }

      const updated_user = await this.prisma.user.update({
        where: { id },
        data: {
          firstname: updateUserDto.firstname,
          lastname: updateUserDto.lastname,
          email: updateUserDto.email,
          role: updateUserDto.role,
          is_active: updateUserDto.is_active,
        },
      });
      return { message: 'User updated successfully.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // DELETE USER
  // *****************
  async delete_user(id: number) {
    try {
      // confirm if user exist
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('A user with this id does not exist.');
      }

      const deleted_user = await this.prisma.user.delete({
        where: { id },
      });
      return { message: 'user deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
