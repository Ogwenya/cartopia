import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CustomerGuard } from 'src/auth/customer.guard';
import { AddressDto } from './dto/address.dto';

@Controller('addresses')
@UseGuards(CustomerGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Req() request: Request, @Body() addressDto: AddressDto) {
    const logged_in_user = request['logged_in_user'];
    return this.addressesService.create(addressDto, logged_in_user.id);
  }

  @Get()
  findAll(@Req() request: Request) {
    const logged_in_user = request['logged_in_user'];
    return this.addressesService.findAll(logged_in_user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() addressDto: AddressDto,
  ) {
    const logged_in_user = request['logged_in_user'];
    return this.addressesService.update(+id, logged_in_user.id, addressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const logged_in_user = request['logged_in_user'];
    return this.addressesService.remove(+id, logged_in_user.id);
  }
}
