import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateBrandDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
