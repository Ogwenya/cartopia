import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  DiscountType,
  Product,
  ProductStatus,
} from 'src/database/entities/product.entity';
import { ProductImage } from 'src/database/entities/product-image.entity';
import { CategoriesService } from '../categories/categories.service';
import { BrandsService } from '../brands/brands.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // **************************
  // CHECK IF CATEGORY EXIST
  // ************************
  async check_product_category(name: string) {
    try {
      const category = await this.categoriesService.find_by_name(name);

      if (!category) {
        throw new NotFoundException(
          'Invalid product category, create it before attempting to add a product',
        );
      }

      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***********************
  // CHECK IF BRAND EXIST
  // ***********************
  async check_product_brand(name: string) {
    try {
      const brand = await this.brandsService.find_by_name(name);

      if (!brand) {
        throw new NotFoundException(
          'Invalid product brand, create it before attempting to add a product',
        );
      }

      return brand;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // ADD NEW PRODUCT
  // *****************
  async create(
    createProductDto: CreateProductDto,
    images: Array<Express.Multer.File>,
  ) {
    try {
      // check if product already exist
      const product_already_exist = await this.productRepository.findOneBy({
        name: createProductDto.name,
      });

      if (product_already_exist) {
        throw new BadRequestException(
          'A product with this name already exist.',
        );
      }

      // get the category
      const product_category = await this.check_product_category(
        createProductDto.category,
      );

      const product_brand = await this.check_product_brand(
        createProductDto.brand,
      );

      // upload product images
      const uploaded_images =
        await this.cloudinaryService.upload_multiple_files(
          images,
          'cartopia/products',
        );

      const product = this.productRepository.create({
        name: createProductDto.name,
        slug: slugify(createProductDto.name, {
          lower: true,
          locale: 'en',
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
        description: createProductDto.description,
        price: parseFloat(createProductDto.price),
        discount_type: DiscountType[createProductDto.discount_type],
        discount_value: parseFloat(createProductDto.discount_value),
        in_stock: parseInt(createProductDto.in_stock),
        category: product_category,
        brand: product_brand,
      });

      const product_images = uploaded_images.map((img) => {
        const image = new ProductImage();
        image.image_url = img.image_url;
        image.public_id = img.public_id;
        image.product = product;
        return image;
      });

      product.images = product_images;

      await this.productRepository.save(product);

      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // GET ALL PRODUCTS
  // *****************
  async findAll() {
    try {
      return await this.productRepository.find({
        relations: { orderItem: true, brand: true, category: true },
        order: { updated_at: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // GET ALL PRODUCTS PER BRAND
  // ***************************
  async find_products_per_brand(brandId: number) {
    try {
      return await this.productRepository.find({
        where: { brand: { id: brandId } },
        relations: { orderItem: true, brand: true, category: true },
        order: { updated_at: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // FIND ONE PRODUCT
  // *****************
  async findOne(slug: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { slug },
        relations: {
          images: true,
          brand: true,
          category: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Product does not exist.');
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ****************
  // UPDATE PRODUCT
  // ****************
  async update(
    slug: string,
    updateProductDto: UpdateProductDto,
    images: Array<Express.Multer.File>,
  ) {
    try {
      const product = await this.findOne(slug);

      const product_category = await this.check_product_category(
        updateProductDto.category,
      );

      const product_brand = await this.check_product_brand(
        updateProductDto.brand,
      );

      const updates = {
        name: updateProductDto.name,
        slug: slugify(updateProductDto.name, {
          lower: true,
          locale: 'en',
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
        price: parseFloat(updateProductDto.price),
        discount_type: DiscountType[updateProductDto.discount_type],
        discount_value: parseFloat(updateProductDto.discount_value),
        description: updateProductDto.description,
        status: ProductStatus[updateProductDto.status],
        in_stock: parseInt(updateProductDto.in_stock),
        category: product_category,
        brand: product_brand,
      };

      Object.assign(product, updates);

      if (images.length > 0) {
        const product_images =
          await this.cloudinaryService.upload_multiple_files(
            images,
            'cartopia/products',
          );

        const new_images = product_images.map((img) => {
          const image = new ProductImage();
          image.image_url = img.image_url;
          image.public_id = img.public_id;
          image.product = product;
          return image;
        });

        await this.productImageRepository.save(new_images);
      }

      await this.productRepository.save(product);

      return await this.productRepository.findOneBy({
        id: product.id,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // DELETE PRODUCT
  // ***************
  async remove(slug: string) {
    try {
      const product = await this.findOne(slug);

      if (product.orderItem.length > 0) {
        throw new NotAcceptableException(
          'This product is already associated with an order, change the status to INACTIVE instead and customers will not be able to make new orders or view it.',
        );
      }

      for (const image of product.images) {
        await this.cloudinaryService.deleteFile(image.public_id);
      }

      await this.productImageRepository.remove(product.images);

      await this.productRepository.remove(product);

      return { message: 'Product successfully deleted' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
