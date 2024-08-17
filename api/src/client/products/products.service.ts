import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { CampaignImagesService } from '../campaign-images/campaign-images.service';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private brandService: BrandsService,
    private categoryService: CategoriesService,
    private campaignImagesService: CampaignImagesService,
  ) {}

  // ******************
  // GET ALL PRODUCTS
  // ******************
  async findAll(productQueryDto: ProductQueryDto) {
    try {
      const { page, search } = productQueryDto;
      const PRODUCTS_PER_PAGE = 24;

      let query = {};

      if (search) {
        query = {
          status: 'ACTIVE',
          OR: [
            { name: { contains: search } },
            { brand: { name: { contains: search } } },
            { category: { name: { contains: search } } },
          ],
        };
      } else {
        query = { status: 'ACTIVE' };
      }

      // pagination
      const page_number = page < 1 ? 1 : page;

      const skip_count = (page_number - 1) * PRODUCTS_PER_PAGE;

      const products = await this.prisma.product.findMany({
        where: query,
        take: PRODUCTS_PER_PAGE,
        skip: skip_count,
        include: {
          images: true,
          brand: true,
          category: true,
        },
        orderBy: { updated_at: 'desc' },
      });

      const total_Products = await this.prisma.product.count({ where: query });

      const total_pages = Math.ceil(total_Products / PRODUCTS_PER_PAGE);

      const categories = await this.prisma.category.findMany();
      const brands = await this.prisma.brand.findMany();

      return { products, total_pages, brands, categories };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  // ****************************
  // GET single PRODUCT per slug
  // ****************************
  async findOne(slug: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { slug },
        include: {
          brand: true,
          category: true,
          images: true,
        },
      });

      if (!product) {
        throw new NotFoundException();
      }

      return product;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  // ****************************
  // GET FEATURE PRODUCTS
  // ****************************
  async get_feature_products() {
    try {
      const brands = await this.brandService.findAll();
      const categories = await this.categoryService.findAll();
      const campaign_images = await this.campaignImagesService.findAll();

      // latest products
      const latest_products = await this.prisma.product.findMany({
        where: { status: 'ACTIVE' },
        take: 20,
        include: {
          images: true,
          brand: true,
          category: true,
        },
        orderBy: { updated_at: 'desc' },
      });

      // get products for top brands
      const feature_products_per_brand = await this.prisma.brand.findMany({
        where: {
          products: {
            some: {
              status: 'ACTIVE', // Ensure there's at least one active product
            },
          },
        },
        take: 3,
        orderBy: {
          products: {
            _count: 'desc',
          },
        },
        include: {
          products: {
            where: {
              status: 'ACTIVE', // Fetch only active products
            },
            include: {
              brand: true,
              category: true,
              images: true,
            },
          },
        },
      });

      // get products for top categories
      const feature_products_per_category = await this.prisma.category.findMany(
        {
          where: {
            products: {
              some: {
                status: 'ACTIVE', // Ensure there's at least one active product
              },
            },
          },
          take: 3,
          orderBy: {
            products: {
              _count: 'desc',
            },
          },
          include: {
            products: {
              where: {
                status: 'ACTIVE', // Fetch only active products
              },
              include: {
                brand: true,
                category: true,
                images: true,
              },
            },
          },
        },
      );

      return {
        campaign_images,
        brands,
        categories,
        latest_products,
        feature_products_per_brand,
        feature_products_per_category,
      };
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
