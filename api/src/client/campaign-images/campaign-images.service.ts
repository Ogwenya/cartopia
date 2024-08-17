import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CampaignImagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const images = await this.prisma.campaign.findMany();
      return images;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
