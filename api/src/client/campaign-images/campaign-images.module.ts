import { Module } from '@nestjs/common';
import { CampaignImagesService } from './campaign-images.service';
import { CampaignImagesController } from './campaign-images.controller';

@Module({
  controllers: [CampaignImagesController],
  providers: [CampaignImagesService],
})
export class CampaignImagesModule {}
