import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, CloudinaryService, PrismaService],
})
export class BrandsModule {}
