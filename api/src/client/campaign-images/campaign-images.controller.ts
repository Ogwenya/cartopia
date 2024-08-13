import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CampaignImagesService } from './campaign-images.service';

@Controller('campaign-images')
@ApiTags('Frontend Campaign images')
@ApiBearerAuth('defaultBearerAuth')
export class CampaignImagesController {
  constructor(private readonly campaignImagesService: CampaignImagesService) {}

  @Get()
  findAll() {
    return this.campaignImagesService.findAll();
  }
}
