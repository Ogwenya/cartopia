import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Match } from '../match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @Match('password', { message: 'Passwords do not match' })
  confirm_password: string;
}
