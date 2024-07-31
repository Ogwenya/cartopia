import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async check_product_category(name: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { name },
      });

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

  // *****************
  // ADD NEW PRODUCT
  // *****************
  async create(
    createProductDto: CreateProductDto,
    images: Array<Express.Multer.File>,
  ) {
    try {
      // check if product already exist
      const product_already_exist = await this.prisma.product.findUnique({
        where: { name: createProductDto.name },
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

      // upload product images
      const product_images = await this.cloudinaryService.upload_multiple_files(
        images,
        'cartopia/products',
      );

      const new_product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          slug: slugify(createProductDto.name, {
            lower: true,
            locale: 'en',
            strict: true,
            remove: /[*+~.()'"!:@]/g,
          }),
          description: createProductDto.description,
          price: parseFloat(createProductDto.price),
          discount_type: createProductDto.discount_type,
          discount_value: parseFloat(createProductDto.discount_value),
          in_stock: parseInt(createProductDto.in_stock),
          category: { connect: { id: product_category.id } },
          brand: {
            connectOrCreate: {
              where: { name: createProductDto.brand },
              create: {
                name: createProductDto.brand,
                slug: slugify(createProductDto.brand, {
                  lower: true,
                  locale: 'en',
                  strict: true,
                  remove: /[*+~.()'"!:@]/g,
                }),
              },
            },
          },
          images: {
            create: product_images,
          },
        },
        include: {
          images: true,
          brand: true,
          category: true,
        },
      });
      return new_product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *****************
  // GET ALL PRODUCTS
  // *****************
  async findAll() {
    try {
      return await this.prisma.product.findMany({
        include: { orderItem: true, brand: true, category: true },
        orderBy: { updated_at: 'desc' },
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
      const product = await this.prisma.product.findUnique({
        where: { slug },
        include: {
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

      // get the category

      const product_category = await this.check_product_category(
        updateProductDto.category,
      );

      if (images.length === 0) {
        const updated_product = await this.prisma.product.update({
          where: { slug },
          data: {
            name: updateProductDto.name,
            slug: slugify(updateProductDto.name, {
              lower: true,
              locale: 'en',
              strict: true,
              remove: /[*+~.()'"!:@]/g,
            }),
            price: parseFloat(updateProductDto.price),
            discount_type: updateProductDto.discount_type,
            discount_value: parseFloat(updateProductDto.discount_value),
            description: updateProductDto.description,
            status: updateProductDto.status,
            in_stock: parseInt(updateProductDto.in_stock),
            category: { connect: { id: product_category.id } },
            brand: {
              connectOrCreate: {
                where: { name: updateProductDto.brand },
                create: {
                  name: updateProductDto.brand,
                  slug: slugify(updateProductDto.brand, {
                    lower: true,
                    locale: 'en',
                    strict: true,
                    remove: /[*+~.()'"!:@]/g,
                  }),
                },
              },
            },
          },
          include: {
            images: true,
            brand: true,
            category: true,
          },
        });

        return updated_product;
      } else {
        // upload product images
        const product_images =
          await this.cloudinaryService.upload_multiple_files(
            images,
            'cartopia/products',
          );

        const updated_product = await this.prisma.product.update({
          where: { slug },
          data: {
            name: updateProductDto.name,
            slug: slugify(updateProductDto.name, {
              lower: true,
              locale: 'en',
              strict: true,
              remove: /[*+~.()'"!:@]/g,
            }),
            price: parseFloat(updateProductDto.price),
            discount_type: updateProductDto.discount_type,
            discount_value: parseFloat(updateProductDto.discount_value),
            description: updateProductDto.description,
            status: updateProductDto.status,
            in_stock: parseInt(updateProductDto.in_stock),
            category: { connect: { id: product_category.id } },
            brand: {
              connectOrCreate: {
                where: { name: updateProductDto.brand },
                create: {
                  name: updateProductDto.brand,
                  slug: slugify(updateProductDto.brand, {
                    lower: true,
                    locale: 'en',
                    strict: true,
                    remove: /[*+~.()'"!:@]/g,
                  }),
                },
              },
            },
            images: {
              create: product_images,
            },
          },
          include: {
            images: true,
            brand: true,
            category: true,
          },
        });

        return updated_product;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // DELETE PRODUCT
  // ***************
  async remove(slug: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { slug },
        include: {
          images: true,
          brand: true,
          category: true,
          orderItem: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Product does not exist.');
      }

      if (product.orderItem.length > 0) {
        throw new NotAcceptableException(
          'This product is already associated with an order, change the status to INACTIVE instead and customers will not be able to make new orders or view it.',
        );
      }

      const deleted_product = await this.prisma.product.delete({
        where: { slug },
        include: { images: true },
      });

      const images = product.images;

      for (let i = 0; i < images.length; i++) {
        await this.cloudinaryService.deleteFile(images[i].public_id);
      }

      return deleted_product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
