import { Test, TestingModule } from '@nestjs/testing';
import { CampaignImagesService } from './campaign-images.service';

describe('CampaignImagesService', () => {
  let service: CampaignImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignImagesService],
    }).compile();

    service = module.get<CampaignImagesService>(CampaignImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
