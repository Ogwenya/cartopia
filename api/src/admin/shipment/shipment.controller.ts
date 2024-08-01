import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShipmentService } from './shipment.service';
import { AllAdminsGuard } from 'src/shared/auth/all-admins.guard';
import { CreateShipmentLocationDto } from './dto/create-shipment-location.dto';
import { UpdateShipmentLocationDto } from './dto/update-shipment-location.dto';
import { CreateShipmentCountyDto } from './dto/create-shipment-county.dto';
import { UpdateShipmentCountyDto } from './dto/update-shipment-county.dto';

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

  @Post('')
  createCounty(@Body() createShipmentCountyDto: CreateShipmentCountyDto) {
    return this.shipmentService.createCounty(createShipmentCountyDto);
  }

  @Get(':county_id')
  find_county(@Param('county_id') county_id: string) {
    return this.shipmentService.find_county(+county_id);
  }

  @Post(':county_id')
  createLocation(
    @Param('county_id') county_id: string,
    @Body() createShipmentLocationDto: CreateShipmentLocationDto,
  ) {
    return this.shipmentService.createLocation(
      +county_id,
      createShipmentLocationDto,
    );
  }

  @Patch(':county_id')
  update_county(
    @Param('county_id') county_id: string,
    @Body() updateShipmentCountyDto: UpdateShipmentCountyDto,
  ) {
    return this.shipmentService.updateCounty(
      +county_id,
      updateShipmentCountyDto,
    );
  }

  @Delete(':county_id')
  delete_county(@Param('county_id') county_id: string) {
    return this.shipmentService.delete_county(+county_id);
  }

  @Patch(':county_id/:location_id')
  update_location(
    @Param('county_id') county_id: string,
    @Param('location_id') location_id: string,
    @Body() updateShipmentLocationDto: UpdateShipmentLocationDto,
  ) {
    return this.shipmentService.update_location(
      +county_id,
      +location_id,
      updateShipmentLocationDto,
    );
  }

  @Delete(':county_id/:location_id')
  delete_location(
    @Param('county_id') county_id: string,
    @Param('location_id') location_id: string,
  ) {
    return this.shipmentService.delete_location(+location_id);
  }
}
