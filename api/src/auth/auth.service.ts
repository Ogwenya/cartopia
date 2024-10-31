import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerateResetTokenDto } from './dto/reset-token.dto';
import { ResetPasswordDto } from './dto/password-reset.dto';
import { LoginDto } from './dto/login.dto';
import { isAdministrator } from 'src/utils/type-guards';
import { User } from 'src/database/entities/user.entity';
import { Customer } from 'src/database/entities/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ************
  // GET USER
  // ************
  async find_user_by_key(
    key: string,
    value: string | number,
    account_type: 'administrator' | 'customer',
  ) {
    try {
      const user =
        account_type === 'administrator'
          ? await this.userRepository.findOneBy({ [key]: value })
          : await this.customerRepository.findOneBy({ [key]: value });

      if (!user) {
        throw new NotFoundException(`invalid ${key}.`);
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
      const user = await this.find_user_by_key(
        'email',
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
      const user = await this.find_user_by_key(
        'email',
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
          ? await this.userRepository.update(
              { email: generateResetTokenDto.email },
              {
                password_reset_token: hashed_token,
                password_reset_token_expiry: token_expiry,
              },
            )
          : await this.customerRepository.update(
              { email: generateResetTokenDto.email },
              {
                password_reset_token: hashed_token,
                password_reset_token_expiry: token_expiry,
              },
            );

      this.eventEmitter.emit('user.reset-password', {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        token: token,
        userId: user.id,
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

      const user = await this.find_user_by_key(
        'id',
        id,
        resetPasswordDto.account_type,
      );

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

      const updated_user =
        resetPasswordDto.account_type === 'administrator'
          ? await this.userRepository.update(
              { id },
              {
                password: new_Password_hashed,
                password_reset_token: null,
                password_reset_token_expiry: null,
              },
            )
          : await this.customerRepository.update(
              { id },
              {
                password: new_Password_hashed,
                password_reset_token: null,
                password_reset_token_expiry: null,
              },
            );

      return {
        message: 'Password successfully reset, you can proceed to login.',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
