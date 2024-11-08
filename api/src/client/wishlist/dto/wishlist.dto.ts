import { IsNumber, IsPositive } from 'class-validator';

export class WishlistDto {
	@IsNumber()
	@IsPositive()
	product_id: number;
}
