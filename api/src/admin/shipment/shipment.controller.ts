import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShipmentService } from './shipment.service';
import { AllAdminsGuard } from 'src/auth/all-admins.guard';
import { UpdateShipmentFeesDto } from './dto/update-shipment-fees.dto';

@Controller('shipment')
@UseGuards(AllAdminsGuard)
@ApiTags('Admin Shipment')
@ApiBearerAuth('defaultBearerAuth')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get()
  findAll() {
    return this.shipmentService.findAll();
  }

  @Get(':county_id')
  find_county(@Param('county_id') county_id: string) {
    return this.shipmentService.find_county(+county_id);
  }

  @Get(':county_id/:sub_county_id')
  find_sub_county(
    @Param('county_id') county_id: string,
    @Param('sub_county_id') sub_county_id: string,
  ) {
    return this.shipmentService.find_sub_county(+county_id, +sub_county_id);
  }

  @Patch('wards/:id')
  update_fees(
    @Param('id') id: string,
    @Body() updateShipmentFeesDto: UpdateShipmentFeesDto,
  ) {
    return this.shipmentService.update_fees(+id, updateShipmentFeesDto);
  }
}
