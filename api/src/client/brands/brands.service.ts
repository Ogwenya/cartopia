import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BrandQueryDto } from './dto/brand-query.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  // ***************
  // GET ALL BRANDS
  // ***************
  async findAll() {
    try {
      const brands = await this.prisma.brand.findMany({
        orderBy: { products: { _count: 'desc' } },
      });
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
      const brand = await this.prisma.brand.findUnique({
        where: { slug },
      });

      if (!brand) {
        throw new NotFoundException();
      }

      // pagination
      const { page } = brandQueryDto;
      const PRODUCTS_PER_PAGE = 24;
      const page_number = page < 1 ? 1 : page;

      const skip_count = (page_number - 1) * PRODUCTS_PER_PAGE;

      const products = await this.prisma.product.findMany({
        where: { status: 'ACTIVE', brand: { slug } },
        take: PRODUCTS_PER_PAGE,
        skip: skip_count,
        include: {
          images: true,
          brand: true,
          category: true,
        },
        orderBy: { updated_at: 'desc' },
      });

      const total_Products = await this.prisma.product.count({
        where: { status: 'ACTIVE', brand: { slug } },
      });

      const total_pages = Math.ceil(total_Products / PRODUCTS_PER_PAGE);

      const brands = await this.findAll();
      const categories = await this.prisma.category.findMany();

      return { products, total_pages, brands, categories };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
