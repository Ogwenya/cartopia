import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { GenerateResetTokenDto } from './dto/reset-token.dto';
import { ResetPasswordDto } from './dto/password-reset.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('generate-reset-token')
  generateResetToken(@Body() generateResetTokenDto: GenerateResetTokenDto) {
    return this.authService.generateResetToken(generateResetTokenDto);
  }

  @Patch('password-reset/:id/:token')
  resetPassword(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(+id, token, resetPasswordDto);
  }
}
