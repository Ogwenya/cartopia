import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProductQueryDto } from './dto/product-query.dto';
import { Product, ProductStatus } from 'src/database/entities/product.entity';
import { Brand } from 'src/database/entities/brand.entity';
import { Category } from 'src/database/entities/category.entity';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { Campaign } from 'src/database/entities/campaign.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  // ******************
  // GET ALL PRODUCTS
  // ******************
  async findAll(productQueryDto: ProductQueryDto) {
    try {
      const { page, search } = productQueryDto;
      const PRODUCTS_PER_PAGE = 24;

      // Build the query based on search term
      let whereConditions: { [key: string]: any } = {
        status: 'ACTIVE',
      };
      if (search) {
        whereConditions = {
          status: 'ACTIVE',
          $or: [
            { name: Like(`%${search}%`) },
            { 'brand.name': Like(`%${search}%`) },
            { 'category.name': Like(`%${search}%`) },
          ],
        };
      }

      // Pagination setup
      const page_number = page < 1 ? 1 : page;
      const skip_count = (page_number - 1) * PRODUCTS_PER_PAGE;

      // Fetch products
      const [products, total_Products] = await Promise.all([
        this.productRepository
          .createQueryBuilder('product')
          .leftJoinAndSelect('product.images', 'images')
          .leftJoinAndSelect('product.brand', 'brand')
          .leftJoinAndSelect('product.category', 'category')
          .where(whereConditions)
          .orderBy('product.updated_at', 'DESC')
          .skip(skip_count)
          .take(PRODUCTS_PER_PAGE)
          .getMany(),

        this.productRepository
          .createQueryBuilder('product')
          .where(whereConditions)
          .getCount(),
      ]);

      const total_pages = Math.ceil(total_Products / PRODUCTS_PER_PAGE);

      const [categories, brands] = await Promise.all([
        await this.brandRepository.find(),
        await this.categoryRepository.find(),
      ]);

      return {
        products,
        total_pages,
        brands,
        categories,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  // ****************************
  // GET single PRODUCT per slug
  // ****************************
  async findOne(slug: string, customer_id: number | null) {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.images', 'images')
        .leftJoinAndSelect(
          'product.wishlist',
          'wishlist',
          'wishlist.customer.id = :customer_id',
          { customer_id },
        )
        .where('product.slug = :slug', { slug })
        .getOne();

      if (!product) {
        throw new NotFoundException();
      }

      if (customer_id) {
        const cartItems = await this.cartItemRepository.find({
          where: {
            cart: { customer: { id: customer_id } },
            product: { id: product.id },
          },
          relations: ['cart'],
        });

        product.cart_items = cartItems;
      }

      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ****************************
  // GET FEATURE PRODUCTS
  // ****************************
  async get_feature_products() {
    try {
      const brands = await this.brandRepository.find();
      const categories = await this.categoryRepository.find();
      const campaign_images = await this.campaignRepository.find();

      const latest_products = await this.productRepository.find({
        where: { status: ProductStatus.ACTIVE },
        relations: ['brand', 'category', 'images'],
        take: 20,
        order: { updated_at: 'DESC' },
      });

      const top_brand_ids = await this.brandRepository
        .createQueryBuilder('brand')
        .leftJoin('brand.products', 'product')
        .select(['brand.id', 'COUNT(product.id) as productCount'])
        .groupBy('brand.id')
        .orderBy('productCount', 'DESC')
        .limit(3)
        .getRawMany();

      const feature_products_per_brand =
        top_brand_ids.length > 0
          ? await this.brandRepository
              .createQueryBuilder('brand')
              .leftJoinAndSelect('brand.products', 'product')
              .leftJoinAndSelect('product.images', 'productImage')
              .where('brand.id IN (:...ids)', {
                ids: top_brand_ids.map((b) => b.brand_id),
              })
              .orderBy(
                `CASE brand.id ${top_brand_ids
                  .map((b, index) => `WHEN ${b.brand_id} THEN ${index}`)
                  .join(' ')} END`,
              )
              .getMany()
          : [];

      const top_category_ids = await this.brandRepository
        .createQueryBuilder('brand')
        .leftJoin('brand.products', 'product')
        .select(['brand.id', 'COUNT(product.id) as productCount'])
        .groupBy('brand.id')
        .orderBy('productCount', 'DESC')
        .limit(3)
        .getRawMany();

      const feature_products_per_category =
        top_category_ids.length > 0
          ? await this.categoryRepository
              .createQueryBuilder('category')
              .leftJoinAndSelect('category.products', 'product')
              .leftJoinAndSelect('product.images', 'productImage')
              .where('category.id IN (:...ids)', {
                ids: top_category_ids.map((b) => b.brand_id),
              })
              .orderBy(
                `CASE category.id ${top_category_ids
                  .map((b, index) => `WHEN ${b.brand_id} THEN ${index}`)
                  .join(' ')} END`,
              )
              .getMany()
          : [];

      return {
        campaign_images,
        brands,
        categories,
        latest_products,
        feature_products_per_brand,
        feature_products_per_category,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }
}
