import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateShipmentLocationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber()
  fees: number;
}
