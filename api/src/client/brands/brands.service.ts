import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandQueryDto } from './dto/brand-query.dto';
import { Brand } from 'src/database/entities/brand.entity';
import { Product, ProductStatus } from 'src/database/entities/product.entity';
import { Category } from 'src/database/entities/category.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // ***************
  // GET ALL BRANDS
  // ***************
  async findAll() {
    try {
      const brands = await this.brandRepository
        .createQueryBuilder('brand')
        .leftJoinAndSelect('brand.products', 'products')
        .loadRelationCountAndMap('brand.productCount', 'brand.products')
        .orderBy('brand.productCount', 'DESC')
        .getMany();

      return brands;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  // ***************************
  // GET ALL PRODUCTS PER BRAND
  // ***************************
  async findOne(slug: string, brandQueryDto: BrandQueryDto) {
    try {
      const brand = await this.brandRepository.findOneBy({ slug });

      if (!brand) {
        throw new NotFoundException();
      }

      // pagination
      const { page } = brandQueryDto;
      const PRODUCTS_PER_PAGE = 24;
      const page_number = page < 1 ? 1 : page;

      const skip_count = (page_number - 1) * PRODUCTS_PER_PAGE;

      const products = await this.productRepository.find({
        where: { status: ProductStatus.ACTIVE, brand: { slug } },
        take: PRODUCTS_PER_PAGE,
        skip: skip_count,
        relations: ['images', 'brand', 'category'],
        order: { updated_at: 'DESC' },
      });

      const total_Products = await this.productRepository.count({
        where: { status: ProductStatus.ACTIVE, brand: { slug } },
      });

      const total_pages = Math.ceil(total_Products / PRODUCTS_PER_PAGE);

      const brands = await this.brandRepository.find();

      const categories = await this.categoryRepository.find();

      return { products, total_pages, brands, categories };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
