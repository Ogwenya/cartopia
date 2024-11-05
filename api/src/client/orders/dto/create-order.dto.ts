import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
	@IsNumber()
	@IsPositive()
	address_id: number;
}
