import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './shared/email/email.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientModule } from './client/client.module';
import { PaystackService } from './shared/paystack/paystack.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AdminModule,
    AuthModule,
    EmailModule,
    CloudinaryModule,
    ClientModule,
  ],
  controllers: [],
  providers: [PaystackService],
})
export class AppModule {}
