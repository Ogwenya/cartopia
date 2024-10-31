import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Category } from 'src/database/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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
      const category_already_exist = await this.categoryRepository.findOneBy({
        name: createCategoryDto.name,
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

      const category = this.categoryRepository.create({
        name: createCategoryDto.name,
        slug: slugify(createCategoryDto.name, {
          lower: true,
          locale: 'en',
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
        image_url: uploaded_image.secure_url,
        image_public_id: uploaded_image.public_id,
      });

      await this.categoryRepository.save(category);

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
      return await this.categoryRepository.find({
        relations: {
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
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: { products: true },
      });

      if (!category) {
        throw new NotFoundException('A category with this id does not exist.');
      }
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *******************
  // GET CATEGORY BY NAME
  // *******************
  async find_by_name(name: string) {
    try {
      return await this.categoryRepository.findOneBy({ name });
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

      await this.categoryRepository.update({ id }, data);

      if (image) {
        // remove previous service image
        await this.cloudinaryService.deleteFile(category.image_public_id);
      }

      return { message: 'Category updated successfully' };
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

      await this.categoryRepository.delete(id);

      // delete category image
      await this.cloudinaryService.deleteFile(category.image_public_id);

      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
