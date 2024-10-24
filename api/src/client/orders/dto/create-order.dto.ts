import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
	@IsNumber()
	@IsPositive()
	location_id: number;
}
