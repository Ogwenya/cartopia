import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  // ***************
  // ADD NEW BRAND
  // ***************
  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand_already_exist = await this.prisma.brand.findUnique({
        where: { name: createBrandDto.name },
      });

      if (brand_already_exist) {
        throw new BadRequestException('A brand with this name does not exist.');
      }

      const new_brand = await this.prisma.brand.create({
        data: {
          name: createBrandDto.name,
          slug: slugify(createBrandDto.name, {
            lower: true,
            locale: 'en',
            strict: true,
            remove: /[*+~.()'"!:@]/g,
          }),
        },
      });

      return new_brand;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // GET ALL BRANDS
  // ***************
  async findAll() {
    try {
      return await this.prisma.brand.findMany({
        include: { products: true },
        orderBy: { updated_at: 'desc' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // *******************
  // GET BRAND PER SLUG
  // *******************
  async findOne(slug: string) {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: { slug },
      });

      if (!brand) {
        throw new BadRequestException('A brand with this slug does not exist.');
      }

      return brand;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // UPDATE BRAND
  // ***************
  async update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: { id },
      });

      if (!brand) {
        throw new BadRequestException('A brand with this id does not exist.');
      }

      const updated_brand = await this.prisma.brand.update({
        where: { id },
        data: {
          name: updateBrandDto.name,
          slug: slugify(updateBrandDto.name, {
            lower: true,
            locale: 'en',
            strict: true,
            remove: /[*+~.()'"!:@]/g,
          }),
        },
      });

      return updated_brand;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************
  // DELETE BRAND
  // ***************
  async remove(id: number) {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!brand) {
        throw new BadRequestException('A brand with this id does not exist.');
      }

      if (brand.products.length > 0) {
        throw new BadRequestException(
          `This brand is already associated with ${brand.products.length} products, move the products to another brand before attempting to delete.`,
        );
      }

      const deleted_brand = await this.prisma.brand.delete({
        where: { id },
      });

      return deleted_brand;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
