import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from 'src/database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      const user_exist = await this.userRepository.findOneBy({
        email: createUserDto.email,
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

      const user = this.userRepository.create({
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        email: createUserDto.email,
        password: hashed_password,
        role: Role[createUserDto.role],
      });

      await this.userRepository.save(user);

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
      const users = this.userRepository.find({
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
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('A user with this id does not exist.');
      }

      await this.userRepository.update(
        { id },
        {
          firstname: updateUserDto.firstname,
          lastname: updateUserDto.lastname,
          email: updateUserDto.email,
          role: Role[updateUserDto.role],
          is_active: updateUserDto.is_active,
        },
      );

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
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('A user with this id does not exist.');
      }

      await this.userRepository.remove(user);

      return { message: 'user deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
