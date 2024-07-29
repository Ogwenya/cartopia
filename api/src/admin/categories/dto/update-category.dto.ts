import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
