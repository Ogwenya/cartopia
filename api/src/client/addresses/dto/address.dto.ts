import {
	IsBoolean,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	MinLength,
} from 'class-validator';

export class AddressDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsString()
	@IsPhoneNumber('KE')
	phone_number: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	county: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	town: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	area: string;

	@IsBoolean()
	is_default: boolean;
}
