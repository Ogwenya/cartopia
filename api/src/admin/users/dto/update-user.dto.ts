import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['SUPER_USER', 'ADMIN'], {
    message: 'Role can either be SUPER_USER or ADMIN.',
  })
  role: 'SUPER_USER' | 'ADMIN';

  @IsBoolean()
  is_active: boolean;
}
