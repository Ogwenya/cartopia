import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { isAdministrator, isCustomer } from 'src/utils/type-guards';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  // *****************
  // GET USER PER ID
  // *****************
  async findOneById(id: number, account_type: 'administrator' | 'customer') {
    try {
      const user =
        account_type === 'administrator'
          ? await this.prisma.user.findUnique({
              where: { id },
            })
          : await this.prisma.customer.findUnique({
              where: { id },
            });

      if (!user) {
        throw new NotFoundException('A user with this id does not exist.');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // GET USER PER EMAIL
  // *****************
  async findOneByEmail(
    email: string,
    account_type: 'administrator' | 'customer',
  ) {
    try {
      const user =
        account_type === 'administrator'
          ? await this.prisma.user.findUnique({
              where: { email },
            })
          : await this.prisma.customer.findUnique({
              where: { email },
            });

      if (!user) {
        throw new NotFoundException('A user with this email does not exist.');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ********************
  // UPDATE USER PROFILE
  // ********************
  async updateProfile(
    id: number,
    logged_in_user,
    updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const user = await this.findOneById(id, updateProfileDto.account_type);

      if (
        user.id !== logged_in_user.id ||
        user.firstname !== logged_in_user.firstname ||
        user.lastname !== logged_in_user.lastname ||
        user.email !== logged_in_user.email
      ) {
        throw new NotAcceptableException();
      }

      const data = {
        firstname: updateProfileDto.firstname,
        lastname: updateProfileDto.lastname,
        email: updateProfileDto.email,
      };

      const updated_user =
        updateProfileDto.account_type === 'administrator'
          ? await this.prisma.user.update({
              where: { id },
              data,
            })
          : await this.prisma.customer.update({
              where: { id },
              data: { ...data, phone_number: updateProfileDto.phone_number },
            });

      const payload = {
        id: updated_user.id,
        firstname: updated_user.firstname,
        lastname: updated_user.lastname,
        email: updated_user.email,
      };

      if (isAdministrator(updated_user)) {
        payload['role'] = updated_user.role;
        payload['is_active'] = updated_user.is_active;
      }

      if (isCustomer(updated_user)) {
        payload['phone_number'] = updated_user.phone_number;
      }

      return {
        access_token: await this.jwtService.signAsync(payload),
        message: 'Profile updated successfully.',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // UPDATE PASSWORD
  // *****************
  async updatePassword(
    id: number,
    logged_in_user,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      // confirm if user exist
      const user = await this.findOneById(id, updatePasswordDto.account_type);

      if (
        user.id !== logged_in_user.id ||
        user.firstname !== logged_in_user.firstname ||
        user.lastname !== logged_in_user.lastname ||
        user.email !== logged_in_user.email
      ) {
        throw new NotAcceptableException();
      }

      const { current_password, new_password, confirm_new_password } =
        updatePasswordDto;

      // check if passwords match
      if (new_password !== confirm_new_password) {
        throw new BadRequestException(
          'New Password and new password confirmation do not match.',
        );
      }

      // check if current password is correct
      const is_current_password_correct = await bcrypt.compare(
        current_password,
        user.password,
      );

      if (!is_current_password_correct) {
        throw new BadRequestException(
          'The current password you provided is incorrect.',
        );
      }

      // check if current password is same as new password
      const is_new_password_same_as_old = await bcrypt.compare(
        new_password,
        user.password,
      );

      if (is_new_password_same_as_old) {
        throw new BadRequestException(
          'New Password cannot be same as old password.',
        );
      }

      // change the password
      const salt = await bcrypt.genSalt(10);
      const new_Password_hashed = await bcrypt.hash(new_password, salt);

      const data = { password: new_Password_hashed };

      const updated_user =
        updatePasswordDto.account_type === 'administrator'
          ? await this.prisma.user.update({
              where: { id },
              data,
            })
          : await this.prisma.customer.update({
              where: { id },
              data,
            });

      return { message: 'Password successfully changed.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
