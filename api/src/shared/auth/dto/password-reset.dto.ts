import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  confirm_new_password: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['administrator', 'customer'], {
    message: 'account_type can either be "administrator" or "customer".',
  })
  account_type: 'administrator' | 'customer';
}
