import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsString()
  @IsOptional()
  search: string = '';
}
