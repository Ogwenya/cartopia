import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
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
  @IsString()
  @MinLength(2)
  brand: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  category: string;

  @IsNotEmpty()
  @IsNumberString()
  in_stock: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['ACTIVE', 'INACTIVE'], {
    message: 'Product status can either be ACTIVE or INACTIVE.',
  })
  status: 'ACTIVE' | 'INACTIVE';
}
