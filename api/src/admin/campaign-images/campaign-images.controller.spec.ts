import { Test, TestingModule } from '@nestjs/testing';
import { CampaignImagesController } from './campaign-images.controller';
import { CampaignImagesService } from './campaign-images.service';

describe('CampaignImagesController', () => {
  let controller: CampaignImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignImagesController],
      providers: [CampaignImagesService],
    }).compile();

    controller = module.get<CampaignImagesController>(CampaignImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
