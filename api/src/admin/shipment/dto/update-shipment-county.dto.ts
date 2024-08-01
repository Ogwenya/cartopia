import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateShipmentCountyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
