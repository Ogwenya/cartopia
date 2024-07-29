import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // *******************
  // CREATE NEW CATEGORY
  // *******************
  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    try {
      const category_already_exist = await this.prisma.category.findUnique({
        where: { name: createCategoryDto.name },
      });

      if (category_already_exist) {
        throw new BadRequestException(
          'A category with this name already exist.',
        );
      }

      const uploaded_image = await this.cloudinaryService.uploadFile(
        image,
        'cartopia/categories',
      );

      const category = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          slug: slugify(createCategoryDto.name, {
            lower: true,
            locale: 'en',
            strict: true,
            remove: /[*+~.()'"!:@]/g,
          }),
          image_url: uploaded_image.secure_url,
          image_public_id: uploaded_image.public_id,
        },
      });
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *******************
  // GET ALL CATEGORIES
  // *******************
  async findAll() {
    try {
      return await this.prisma.category.findMany({
        include: {
          products: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *******************
  // GET ONE CATEGORY
  // *******************
  async findOne(id: number) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('A category with this id does not exist.');
      }
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // UPDATE CATEGORY
  // *****************
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    try {
      const category = await this.findOne(id);

      const data = {
        name: updateCategoryDto.name,
        slug: slugify(updateCategoryDto.name, {
          lower: true,
          locale: 'en',
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
      };

      if (image) {
        const uploaded_image = await this.cloudinaryService.uploadFile(
          image,
          'cartopia/categories',
        );

        data['image_url'] = uploaded_image.secure_url;
        data['image_public_id'] = uploaded_image.public_id;
      }

      const updated_category = await this.prisma.category.update({
        where: { id },
        data,
      });

      if (image) {
        // remove previous service image
        await this.cloudinaryService.deleteFile(category.image_public_id);
      }

      return updated_category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ****************
  // DELETE CATEGORY
  // ****************
  async remove(id: number) {
    try {
      const category = await this.findOne(id);

      const deleted_category = await this.prisma.category.delete({
        where: { id },
      });

      // delete category image
      await this.cloudinaryService.deleteFile(category.image_public_id);

      return deleted_category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
