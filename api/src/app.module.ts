import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './shared/email/email.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    AdminModule,
    AuthModule,
    EmailModule,
    CloudinaryModule,
    ClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
