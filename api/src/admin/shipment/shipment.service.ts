import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import seed_shipment_table from 'src/utils/seed_shipment_table';
import { UpdateShipmentFeesDto } from './dto/update-shipment-fees.dto';
import { ShipmentCounty } from 'src/database/entities/shipment-county.entity';
import { ShipmentTown } from 'src/database/entities/shipment-town.entity';
import { ShipmentArea } from 'src/database/entities/shipment-area.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(ShipmentCounty)
    private readonly countyRepository: Repository<ShipmentCounty>,
    @InjectRepository(ShipmentTown)
    private readonly townRepository: Repository<ShipmentTown>,
    @InjectRepository(ShipmentArea)
    private readonly areaRepository: Repository<ShipmentArea>,
  ) {}

  // ***************************
  // GET ALL SHIPMENT LOCATIONS
  // ***************************
  async findAll() {
    try {
      const counties = await this.countyRepository.find({
        relations: {
          shipmentTowns: true,
        },
      });

      if (counties.length === 0) {
        await seed_shipment_table({
          countyRepository: this.countyRepository,
          townRepository: this.townRepository,
          shipmentArea: ShipmentArea,
        });

        const counties = await this.countyRepository.find({
          relations: {
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
      const county_data = await this.countyRepository.findOne({
        where: { id: county_id },
        relations: ['shipmentTowns', 'shipmentTowns.shipment_areas'],
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
      const town_data = await this.townRepository.findOne({
        where: { county: { id: county_id }, id: sub_county_id },
        relations: { shipment_areas: true },
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
      const ward = await this.areaRepository.findOneBy({ id });

      if (!ward) {
        throw new NotFoundException(
          'A shipment Area with this id does not exist.',
        );
      }

      await this.areaRepository.update(
        { id },
        { fees: updateShipmentFeesDto.fees },
      );

      return { message: 'Fees successfully updated' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
