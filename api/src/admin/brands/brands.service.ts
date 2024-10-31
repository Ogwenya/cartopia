import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Brand } from 'src/database/entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ***************
  // ADD NEW BRAND
  // ***************
  async create(createBrandDto: CreateBrandDto, image: Express.Multer.File) {
    try {
      const brand_already_exist = await this.brandRepository.findOneBy({
        name: createBrandDto.name,
      });

      if (brand_already_exist) {
        throw new BadRequestException('A brand with this name does not exist.');
      }

      const uploaded_image = await this.cloudinaryService.uploadFile(
        image,
        'cartopia/brands',
      );

      const brand = this.brandRepository.create({
        name: createBrandDto.name,
        slug: slugify(createBrandDto.name, {
          lower: true,
          locale: 'en',
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
        image_url: uploaded_image.secure_url,
        image_public_id: uploaded_image.public_id,
      });

      await this.brandRepository.save(brand);

      return brand;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // GET ALL BRANDS
  // ***************
  async findAll() {
    try {
      return await this.brandRepository.find({
        relations: { products: true },
        order: { updated_at: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *******************
  // GET BRAND PER SLUG
  // *******************
  async findOne(slug: string) {
    try {
      const brand = await this.brandRepository.findOne({
        where: { slug },
        relations: { products: true },
      });

      if (!brand) {
        throw new BadRequestException('A brand with this slug does not exist.');
      }

      return brand;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // UPDATE BRAND
  // ***************
  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
    image: Express.Multer.File,
  ) {
    try {
      const brand = await this.brandRepository.findOneBy({ id });

      if (!brand) {
        throw new BadRequestException('A brand with this id does not exist.');
      }

      const data = {
        name: updateBrandDto.name,
        slug: slugify(updateBrandDto.name, {
          lower: true,
          locale: 'en',
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
      };

      if (image) {
        const uploaded_image = await this.cloudinaryService.uploadFile(
          image,
          'cartopia/brands',
        );

        data['image_url'] = uploaded_image.secure_url;
        data['image_public_id'] = uploaded_image.public_id;
      }

      await this.brandRepository.update({ id }, data);

      if (image) {
        await this.cloudinaryService.deleteFile(brand.image_public_id);
      }

      return { message: 'Brand successfully updated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ********************
  // GET OR CREATE BRAND
  // ********************
  async find_by_name(name: string) {
    try {
      return await this.brandRepository.findOneBy({ name });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // DELETE BRAND
  // ***************
  async remove(id: number) {
    try {
      const brand = await this.brandRepository.findOne({
        where: { id },
        relations: { products: true },
      });

      if (brand.products.length > 0) {
        throw new BadRequestException(
          `This brand is already associated with ${brand.products.length} products, move the products to another brand before attempting to delete.`,
        );
      }

      await this.brandRepository.delete(id);

      return { message: 'Brand successfully deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
