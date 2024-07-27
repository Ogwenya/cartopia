import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class GenerateResetTokenDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['administrator', 'customer'], {
    message: 'account_type can either be "administrator" or "customer".',
  })
  account_type: 'administrator' | 'customer';
}
