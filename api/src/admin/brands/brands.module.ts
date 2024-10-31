import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [],
  controllers: [BrandsController],
  providers: [BrandsService, CloudinaryService],
  exports: [BrandsService],
})
export class BrandsModule {}
