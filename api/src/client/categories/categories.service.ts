import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryQueryDto } from './dto/category-query.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // *******************
  // GET ALL CATEGORIES
  // *******************
  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { products: { _count: 'desc' } },
      });
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
      const category = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (!category) {
        throw new NotFoundException();
      }

      // pagination
      const { page } = categoryQueryDto;
      const PRODUCTS_PER_PAGE = 24;
      const page_number = page < 1 ? 1 : page;

      const skip_count = (page_number - 1) * PRODUCTS_PER_PAGE;

      const products = await this.prisma.product.findMany({
        where: { status: 'ACTIVE', category: { slug } },
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
        where: { status: 'ACTIVE', category: { slug } },
      });

      const total_pages = Math.ceil(total_Products / PRODUCTS_PER_PAGE);

      const categories = await this.findAll();
      const brands = await this.prisma.brand.findMany();

      return { products, total_pages, brands, categories };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
