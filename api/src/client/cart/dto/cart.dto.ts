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
	@IsEnum(['add', 'remove', 'delete'], {
		message: 'Operation not recognized.',
	})
	operation: 'add' | 'remove' | 'delete';

	@IsNumber()
	@IsPositive()
	product_id: number;
}
