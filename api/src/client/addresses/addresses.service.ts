import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  //#########################################
  // ########## CREATE NEW ADDRESS ##########
  //#########################################
  async create(addressDto: AddressDto, customerId: number) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
        include: { shippingAddresses: true },
      });

      const county = await this.prisma.shipmentCounty.findUnique({
        where: { name: addressDto.county },
        include: { shipmentTowns: { include: { shipment_areas: true } } },
      });

      if (!county) {
        throw new BadRequestException(
          'county with the given name does not exist in our database',
        );
      }

      const sub_county_exist = county.shipmentTowns.find(
        (town) => town.name === addressDto.town,
      );

      if (!sub_county_exist) {
        throw new BadRequestException(
          `sub-county ${addressDto.town} does not exist in county ${addressDto.county}`,
        );
      }

      const ward_exist = sub_county_exist.shipment_areas.find(
        (area) => area.name === addressDto.area,
      );

      if (!ward_exist) {
        throw new BadRequestException(
          `Ward ${addressDto.area} does not exist in sub-county ${addressDto.town}`,
        );
      }

      if (addressDto.is_default === true) {
        await this.prisma.shippingAddress.updateMany({
          where: { customerId },
          data: { default_address: false },
        });
      }

      const existing_addresses = await this.prisma.shippingAddress.count({
        where: { customerId },
      });

      const new_address = await this.prisma.shippingAddress.create({
        data: {
          customerId,
          name: addressDto.name,
          phone_number: addressDto.phone_number,
          shipmentCountyId: county.id,
          shipmentTownId: sub_county_exist.id,
          shipmentAreaId: ward_exist.id,
          default_address:
            existing_addresses > 0 ? addressDto.is_default : true,
        },
      });

      return new_address;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //##########################################
  // ########## FIND USER ADDRESSES ##########
  //##########################################
  async findAll(customerId: number) {
    try {
      const addresses = await this.prisma.shippingAddress.findMany({
        where: { customerId },
        include: { county: true, town: true, area: true },
      });

      const shipment_counties = await this.prisma.shipmentCounty.findMany({
        include: { shipmentTowns: { include: { shipment_areas: true } } },
        orderBy: {
          name: 'asc',
        },
      });

      return { addresses, shipment_counties };
    } catch (error) {
      throw new Error(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  //########################################
  // ########## FIND USER ADDRESS ##########
  //########################################
  async findOne(id: number) {
    try {
      return `This action returns a #${id} address`;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //##########################################
  // ########## UPDATE USER ADDRESS ##########
  //##########################################
  async update(id: number, customerId: number, addressDto: AddressDto) {
    try {
      const address = await this.prisma.shippingAddress.findUnique({
        where: { id, customerId },
      });

      if (!address) {
        throw new BadRequestException(
          'This address does not exist in our database',
        );
      }

      const county = await this.prisma.shipmentCounty.findUnique({
        where: { name: addressDto.county },
        include: { shipmentTowns: { include: { shipment_areas: true } } },
      });

      if (!county) {
        throw new BadRequestException(
          'county with the given name does not exist in our database',
        );
      }

      const sub_county_exist = county.shipmentTowns.find(
        (town) => town.name === addressDto.town,
      );

      if (!sub_county_exist) {
        throw new BadRequestException(
          `sub-county ${addressDto.town} does not exist in county ${addressDto.county}`,
        );
      }

      const ward_exist = sub_county_exist.shipment_areas.find(
        (area) => area.name === addressDto.area,
      );

      if (!ward_exist) {
        throw new BadRequestException(
          `Ward ${addressDto.area} does not exist in sub-county ${addressDto.town}`,
        );
      }

      if (addressDto.is_default === true) {
        await this.prisma.shippingAddress.updateMany({
          where: { customerId },
          data: { default_address: false },
        });
      }

      const updated_address = await this.prisma.shippingAddress.update({
        where: { id, customerId },
        data: {
          name: addressDto.name,
          phone_number: addressDto.phone_number,
          shipmentCountyId: county.id,
          shipmentTownId: sub_county_exist.id,
          shipmentAreaId: ward_exist.id,
          default_address: addressDto.is_default,
        },
      });

      return updated_address;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //##########################################
  // ########## DELETE USER ADDRESS ##########
  //##########################################
  async remove(id: number, customerId: number) {
    try {
      const has_non_complete_orders = await this.prisma.order.findFirst({
        where: {
          shippingAddressId: id,
          customer_id: customerId,
          status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] },
        },
      });

      if (has_non_complete_orders) {
        throw new NotAcceptableException(
          'This address is asscociates with orders that are not yet completed.',
        );
      }

      const deleted_address = await this.prisma.shippingAddress.delete({
        where: { id },
      });

      return deleted_address;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
