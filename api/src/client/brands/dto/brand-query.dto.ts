import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class BrandQueryDto {
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  @IsOptional()
  page: number = 1;
}
