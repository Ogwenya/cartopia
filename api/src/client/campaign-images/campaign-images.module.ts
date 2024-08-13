import { Module } from '@nestjs/common';
import { CampaignImagesService } from './campaign-images.service';
import { CampaignImagesController } from './campaign-images.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CampaignImagesController],
  providers: [CampaignImagesService, PrismaService],
})
export class CampaignImagesModule {}
