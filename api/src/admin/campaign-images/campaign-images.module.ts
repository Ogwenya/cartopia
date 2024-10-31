import { Module } from '@nestjs/common';
import { CampaignImagesService } from './campaign-images.service';
import { CampaignImagesController } from './campaign-images.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [CampaignImagesController],
  providers: [CampaignImagesService, CloudinaryService],
})
export class CampaignImagesModule {}
