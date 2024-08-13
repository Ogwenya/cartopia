import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryQueryDto } from './dto/category-query.dto';

@Controller('categories')
@ApiTags('Frontend Categories')
@ApiBearerAuth('defaultBearerAuth')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @Query() categoryQueryDto: CategoryQueryDto,
  ) {
    return this.categoriesService.findOne(slug, categoryQueryDto);
  }
}
