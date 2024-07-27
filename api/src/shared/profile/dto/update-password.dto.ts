import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  confirm_new_password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['administrator', 'customer'], {
    message: 'account_type can either be "administrator" or "customer".',
  })
  account_type: 'administrator' | 'customer';
}
