import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AllAdminsGuard } from 'src/auth/all-admins.guard';

@Controller('products')
@UseGuards(AllAdminsGuard)
@ApiTags('Admin Products')
@ApiBearerAuth('defaultBearerAuth')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build({
          fileIsRequired: true,
        }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.productsService.create(createProductDto, images);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  @Patch(':slug')
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('slug') slug: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.productsService.update(slug, updateProductDto, images);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.productsService.remove(slug);
  }
}
