import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CategoryQueryDto {
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  @IsOptional()
  page: number = 1;
}
