import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CloudinaryService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
