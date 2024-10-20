import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { CustomerOrAPIKeyGuard } from 'src/auth/customer-or-api-key.guard';

@Controller('products')
@UseGuards(CustomerOrAPIKeyGuard)
@ApiTags('Frontend Products')
@ApiBearerAuth('defaultBearerAuth')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('feature-products')
  getFeatureProducts() {
    return this.productsService.get_feature_products();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Req() request: Request) {
    const logged_in_user = request['logged_in_user'];

    return this.productsService.findOne(slug, logged_in_user?.id);
  }
}
