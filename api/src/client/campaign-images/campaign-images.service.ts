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
      throw new BadRequestException(error.message);
    }
  }
}
