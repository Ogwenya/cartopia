import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryQueryDto } from './dto/category-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/database/entities/brand.entity';
import { Category } from 'src/database/entities/category.entity';
import { Product, ProductStatus } from 'src/database/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // *******************
  // GET ALL CATEGORIES
  // *******************
  async findAll() {
    try {
      const categories = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.products', 'products')
        .loadRelationCountAndMap('category.productCount', 'category.products')
        .orderBy('category.productCount', 'DESC')
        .getMany();

      return categories;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  // **************************
  // GET PRODUCTE PER CATEGORY
  // **************************
  async findOne(slug: string, categoryQueryDto: CategoryQueryDto) {
    try {
      const category = await this.categoryRepository.findOneBy({ slug });

      if (!category) {
        throw new NotFoundException();
      }

      // pagination
      const { page } = categoryQueryDto;
      const PRODUCTS_PER_PAGE = 24;
      const page_number = page < 1 ? 1 : page;

      const skip_count = (page_number - 1) * PRODUCTS_PER_PAGE;

      const products = await this.productRepository.find({
        where: { status: ProductStatus.ACTIVE, category: { slug } },
        take: PRODUCTS_PER_PAGE,
        skip: skip_count,
        relations: ['images', 'brand', 'category'],
        order: { updated_at: 'DESC' },
      });

      const total_Products = await this.productRepository.count({
        where: { status: ProductStatus.ACTIVE, category: { slug } },
      });

      const brands = await this.brandRepository.find();

      const categories = await this.categoryRepository.find();

      const total_pages = Math.ceil(total_Products / PRODUCTS_PER_PAGE);

      return { products, total_pages, brands, categories };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
