import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerGuard } from './customer.guard';
import { APIKeyGuard } from './api-key.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, CustomerGuard, APIKeyGuard],
  exports: [CustomerGuard, APIKeyGuard],
})
export class AuthModule {}
