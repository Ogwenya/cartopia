import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Campaign } from 'src/database/entities/campaign.entity';

@Injectable()
export class CampaignImagesService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
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

      const campaign_image = this.campaignRepository.create({
        image_url: uploaded_image.secure_url,
        image_public_id: uploaded_image.public_id,
      });

      await this.campaignRepository.save(campaign_image);

      return campaign_image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *************************
  // FIND ALL CAMPAIGN IMAGE
  // *************************
  async findAll() {
    try {
      return await this.campaignRepository.find();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***********************
  // DELETE CAMPAIGN IMAGE
  // ***********************
  async remove(id: number) {
    try {
      const image = await this.campaignRepository.findOneBy({ id });

      if (!image) {
        throw new NotFoundException('An image with this id does not exist.');
      }

      // delete the image from cloudinary
      await this.cloudinaryService.deleteFile(image.image_public_id);

      await this.campaignRepository.delete(id);

      return { message: 'Image successfully deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
