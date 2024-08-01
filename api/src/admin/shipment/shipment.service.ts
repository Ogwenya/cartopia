import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShipmentLocationDto } from './dto/create-shipment-location.dto';
import { UpdateShipmentLocationDto } from './dto/update-shipment-location.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateShipmentCountyDto } from './dto/create-shipment-county.dto';
import { UpdateShipmentCountyDto } from './dto/update-shipment-county.dto';

@Injectable()
export class ShipmentService {
  constructor(private prisma: PrismaService) {}

  // ***************************
  // CREATE SHIPMENT COUNTY
  // ***************************
  async createCounty(createShipmentCountyDto: CreateShipmentCountyDto) {
    try {
      const county_exist = await this.prisma.shipmentCounty.findUnique({
        where: {
          name: createShipmentCountyDto.name,
        },
      });

      if (county_exist) {
        throw new NotFoundException('A county with this name already exist.');
      }

      const new_county = await this.prisma.shipmentCounty.create({
        data: {
          name: createShipmentCountyDto.name,
        },
      });

      return new_county;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // GET ALL SHIPMENT LOCATIONS
  // ***************************
  async findAll() {
    try {
      const counties = await this.prisma.shipmentCounty.findMany({
        include: {
          shipmentLocation: true,
        },
      });

      return counties;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ************************************
  // FIND SHIPMENT LOCATIONS PER COUNTY
  // ************************************
  async find_county(county_id: number) {
    try {
      const county_data = await this.prisma.shipmentCounty.findUnique({
        where: {
          id: county_id,
        },
        include: {
          shipmentLocation: true,
        },
      });

      if (!county_data) {
        throw new NotFoundException('A county with this id does not exist.');
      }

      return county_data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // EDIT SHIPMENT COUNTY
  // ***************************
  async updateCounty(
    county_id: number,
    updateShipmentCountyDto: UpdateShipmentCountyDto,
  ) {
    try {
      const county = await this.find_county(county_id);

      const county_exist = await this.prisma.shipmentCounty.findUnique({
        where: { name: updateShipmentCountyDto.name },
      });

      if (county_exist && county_exist.id !== county.id) {
        throw new NotFoundException('A county with this name already exist.');
      }

      const updated_county = await this.prisma.shipmentCounty.update({
        where: { id: county_id },
        data: {
          name: updateShipmentCountyDto.name,
        },
      });

      return updated_county;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // ADD NEW SHIPMENT LOCATION
  // ***************************
  async createLocation(
    county_id: number,
    createShipmentLocationDto: CreateShipmentLocationDto,
  ) {
    try {
      const county_exist = await this.find_county(county_id);

      // check if location already exist
      const location_already_exist =
        await this.prisma.shipmentLocation.findFirst({
          where: {
            name: createShipmentLocationDto.name,
            countyId: county_exist.id,
          },
        });

      if (location_already_exist) {
        throw new BadRequestException(
          'A shipment location with this name already exist exist.',
        );
      }

      const new_location = await this.prisma.shipmentLocation.create({
        data: {
          name: createShipmentLocationDto.name,
          fees: createShipmentLocationDto.fees,
          countyId: county_exist.id,
        },
      });

      return new_location;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // UPDATE SHIPMENT LOCATION
  // ***************************
  async update_location(
    county_id: number,
    location_id: number,
    updateShipmentLocationDto: UpdateShipmentLocationDto,
  ) {
    try {
      const county_exist = await this.find_county(county_id);

      // check if location already exist
      const location_already_exist =
        await this.prisma.shipmentLocation.findFirst({
          where: {
            name: updateShipmentLocationDto.name,
            countyId: county_exist.id,
          },
        });

      if (location_already_exist && location_already_exist.id !== location_id) {
        throw new NotFoundException(
          `A location with this name already exist in ${county_exist.name}`,
        );
      }

      const updated_location = await this.prisma.shipmentLocation.update({
        where: { id: location_id },
        data: {
          name: updateShipmentLocationDto.name,
          fees: updateShipmentLocationDto.fees,
        },
      });

      return updated_location;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // DELETE SHIPMENT COUNTY
  // ***************************
  async delete_county(county_id: number) {
    try {
      const county = await this.find_county(county_id);

      const deleted_county = await this.prisma.shipmentCounty.delete({
        where: { id: county_id },
      });
      return deleted_county;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // DELETE SHIPMENT LOCATION
  // ***************************
  async delete_location(location_id: number) {
    try {
      const location = await this.prisma.shipmentLocation.findUnique({
        where: { id: location_id },
      });

      if (!location) {
        throw new NotFoundException(
          'A shipment location with this id does not exist.',
        );
      }

      const deleted_location = await this.prisma.shipmentLocation.delete({
        where: { id: location_id },
      });
      return deleted_location;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
