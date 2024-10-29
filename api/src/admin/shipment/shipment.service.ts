import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import seed_shipment_table from 'src/utils/seed_shipment_table';
import { UpdateShipmentFeesDto } from './dto/update-shipment-fees.dto';

@Injectable()
export class ShipmentService {
  constructor(private prisma: PrismaService) {}

  // ***************************
  // GET ALL SHIPMENT LOCATIONS
  // ***************************
  async findAll() {
    try {
      const counties = await this.prisma.shipmentCounty.findMany({
        include: {
          shipmentTowns: true,
        },
      });

      if (counties.length === 0) {
        await seed_shipment_table();

        const counties = await this.prisma.shipmentCounty.findMany({
          include: {
            shipmentTowns: true,
          },
        });

        return counties;
      }

      return counties;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ************************************
  // FIND SHIPMENT TOWNS PER COUNTY
  // ************************************
  async find_county(county_id: number) {
    try {
      const county_data = await this.prisma.shipmentCounty.findUnique({
        where: {
          id: county_id,
        },
        include: {
          shipmentTowns: {
            include: {
              _count: {
                select: { shipment_areas: true },
              },
            },
          },
        },
      });

      return county_data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ************************************
  // FIND SHIPMENT WARDS PER SUB-COUNTY
  // ************************************
  async find_sub_county(county_id: number, sub_county_id: number) {
    try {
      const town_data = await this.prisma.shipmentTown.findUnique({
        where: {
          countyId: county_id,
          id: sub_county_id,
        },
        include: {
          shipment_areas: true,
        },
      });

      return town_data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ***************************
  // EDIT SHIPMENT COUNTY
  // ***************************
  async update_fees(id: number, updateShipmentFeesDto: UpdateShipmentFeesDto) {
    try {
      const ward = await this.prisma.shipmentArea.findUnique({
        where: { id },
      });

      if (!ward) {
        throw new NotFoundException(
          'A shipment Area with this id does not exist.',
        );
      }

      const updated_ward = await this.prisma.shipmentArea.update({
        where: { id },
        data: {
          fees: updateShipmentFeesDto.fees,
        },
      });

      return updated_ward;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
