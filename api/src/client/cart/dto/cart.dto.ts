import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsPositive,
	IsString,
} from 'class-validator';

export class CartDto {
	@IsNotEmpty()
	@IsString()
	@IsEnum(['add', 'remove'], {
		message: 'Operation not recognized.',
	})
	operation: 'add' | 'remove';

	@IsNumber()
	@IsPositive()
	product_id: number;
}
