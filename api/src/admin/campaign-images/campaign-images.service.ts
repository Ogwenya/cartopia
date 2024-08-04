import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CampaignImagesService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ***************************
  // UPLOAD NEW CAMPAIGN IMAGE
  // ***************************
  async create(image: Express.Multer.File) {
    try {
      const uploaded_image = await this.cloudinaryService.uploadFile(
        image,
        'cartopia/campaign-images',
      );

      const new_image = await this.prisma.campaign.create({
        data: {
          image_url: uploaded_image.secure_url,
          image_public_id: uploaded_image.public_id,
        },
      });

      return new_image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *************************
  // FIND ALL CAMPAIGN IMAGE
  // *************************
  async findAll() {
    try {
      return await this.prisma.campaign.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***********************
  // DELETE CAMPAIGN IMAGE
  // ***********************
  async remove(id: number) {
    try {
      const image = await this.prisma.campaign.findUnique({
        where: { id },
      });

      if (!image) {
        throw new NotFoundException('An image with this id does not exist.');
      }

      // delete the image from cloudinary
      await this.cloudinaryService.deleteFile(image.image_public_id);

      const deleted_image = await this.prisma.campaign.delete({
        where: { id },
      });
      return deleted_image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
