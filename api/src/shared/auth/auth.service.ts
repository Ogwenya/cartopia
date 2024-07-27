import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';
import { GenerateResetTokenDto } from './dto/reset-token.dto';
import { ResetPasswordDto } from './dto/password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { isAdministrator } from 'src/utils/type-guards';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ************
  // GET USER
  // ************
  async find_user_by_email(
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

      if (isAdministrator(user)) {
        if (!user.is_active) {
          throw new ForbiddenException(
            'This account has been deactivated, reach out to your administrator.',
          );
        }
      }

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ************
  // USER LOGIN
  // ************
  async login(loginDto: LoginDto) {
    try {
      const user = await this.find_user_by_email(
        loginDto.email,
        loginDto.account_type,
      );

      // compare password
      const authenticated = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      // throw error if password is incorrect
      if (!authenticated) {
        throw new ForbiddenException('Incorrect Password');
      }

      const payload = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };

      if (isAdministrator(user)) {
        payload['role'] = user.role;
        payload['is_active'] = user.is_active;
      }
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *******************************
  // GENERATE PASSWORD RESET TOKEN
  // *******************************
  async generateResetToken(generateResetTokenDto: GenerateResetTokenDto) {
    try {
      const user = await this.find_user_by_email(
        generateResetTokenDto.email,
        generateResetTokenDto.account_type,
      );

      const token = randomBytes(32).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashed_token = await bcrypt.hash(token, salt);

      const token_expiry = new Date();
      token_expiry.setHours(token_expiry.getHours() + 1);

      const updated_user_with_token =
        generateResetTokenDto.account_type === 'administrator'
          ? await this.prisma.user.update({
              where: { email: generateResetTokenDto.email },
              data: {
                password_reset_token: hashed_token,
                password_reset_token_expiry: token_expiry,
              },
            })
          : await this.prisma.customer.update({
              where: { email: generateResetTokenDto.email },
              data: {
                password_reset_token: hashed_token,
                password_reset_token_expiry: token_expiry,
              },
            });

      this.eventEmitter.emit('user.reset-password', {
        firstname: updated_user_with_token.firstname,
        lastname: updated_user_with_token.lastname,
        email: updated_user_with_token.email,
        token: token,
        userId: updated_user_with_token.id,
      });

      return { message: 'A password reset link has been sent to your email.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // RESET PASSWORD
  // *****************
  async resetPassword(
    id: number,
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    try {
      const { new_password, confirm_new_password } = resetPasswordDto;

      const user =
        resetPasswordDto.account_type === 'administrator'
          ? await this.prisma.user.findUnique({
              where: { id },
            })
          : await this.prisma.customer.findUnique({
              where: { id },
            });

      if (!user) {
        throw new NotFoundException('A user with this email does not exist.');
      }

      if (isAdministrator(user)) {
        if (!user.is_active) {
          throw new ForbiddenException(
            'This account has been deactivated, reach out to your administrator.',
          );
        }
      }

      // check if token is correct
      if (!user.password_reset_token) {
        throw new BadRequestException('The reset token provided is incorrect.');
      }
      const is_token_correct = await bcrypt.compare(
        token,
        user.password_reset_token,
      );

      if (!is_token_correct) {
        throw new BadRequestException('The reset token provided is incorrect.');
      }

      // check token expiry
      const one_hour_ago = new Date();
      one_hour_ago.setHours(one_hour_ago.getHours() - 1);
      const is_token_expired = one_hour_ago > user.password_reset_token_expiry;

      if (is_token_expired) {
        throw new BadRequestException('The reset token provided has expired.');
      }

      // check if passwords match
      if (new_password !== confirm_new_password) {
        throw new BadRequestException('Passwords do not match.');
      }

      // change the password
      const salt = await bcrypt.genSalt(10);
      const new_Password_hashed = await bcrypt.hash(new_password, salt);

      const updated_user = await this.prisma.user.update({
        where: { id },
        data: {
          password: new_Password_hashed,
          password_reset_token: null,
          password_reset_token_expiry: null,
        },
      });
      return {
        message: 'Password successfully reset, you can proceed to login.',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
