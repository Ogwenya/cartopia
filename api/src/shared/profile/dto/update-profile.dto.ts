import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
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

  @IsString()
  @IsPhoneNumber('KE')
  @IsOptional()
  phone_number?: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['administrator', 'customer'], {
    message: 'account_type can either be "administrator" or "customer".',
  })
  account_type: 'administrator' | 'customer';
}
