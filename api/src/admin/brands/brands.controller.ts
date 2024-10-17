import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  ParseFilePipeBuilder,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AllAdminsGuard } from 'src/auth/all-admins.guard';

@Controller('brands')
@UseGuards(AllAdminsGuard)
@ApiTags('Admin Brands')
@ApiBearerAuth('defaultBearerAuth')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build({
          fileIsRequired: true,
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.brandsService.create(createBrandDto, image);
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.brandsService.findOne(slug);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.brandsService.update(+id, updateBrandDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
