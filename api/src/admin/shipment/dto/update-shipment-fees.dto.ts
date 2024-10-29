import { IsNumber, IsPositive } from 'class-validator';

export class UpdateShipmentFeesDto {
  @IsNumber()
  @IsPositive()
  fees: number;
}
