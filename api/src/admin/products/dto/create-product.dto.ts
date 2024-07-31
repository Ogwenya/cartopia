import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  description: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['NONE', 'Percentage', 'Amount'], {
    message: 'Discount type can either be NONE, Percentage or Amount.',
  })
  discount_type: 'NONE' | 'Percentage' | 'Amount';

  @IsNotEmpty()
  @IsString()
  discount_value: string;

  @IsNotEmpty()
  @IsNumberString()
  in_stock: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  brand: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  category: string;
}
