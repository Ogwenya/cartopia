import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateShipmentCountyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
