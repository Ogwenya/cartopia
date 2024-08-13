import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { BrandQueryDto } from './dto/brand-query.dto';

@Controller('brands')
@ApiTags('Frontend Brands')
@ApiBearerAuth('defaultBearerAuth')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query() brandQueryDto: BrandQueryDto) {
    return this.brandsService.findOne(slug, brandQueryDto);
  }
}
