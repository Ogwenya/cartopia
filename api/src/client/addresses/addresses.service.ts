import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDto } from './dto/address.dto';
import { Customer } from 'src/database/entities/customer.entity';
import { ShipmentCounty } from 'src/database/entities/shipment-county.entity';
import { ShippingAddress } from 'src/database/entities/shipping-address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(ShipmentCounty)
    private readonly countyRepository: Repository<ShipmentCounty>,
    @InjectRepository(ShippingAddress)
    private readonly addressRepository: Repository<ShippingAddress>,
  ) {}

  //#########################################
  // ########## CREATE NEW ADDRESS ##########
  //#########################################
  async create(addressDto: AddressDto, customerId: number) {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
        relations: { shippingAddresses: true },
      });

      const county = await this.countyRepository.findOne({
        where: { name: addressDto.county },
        relations: ['shipmentTowns', 'shipmentTowns.shipment_areas'],
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
        await this.addressRepository.update(
          { customer: { id: customer.id } },
          { default_address: false },
        );
      }

      const existing_addresses = await this.addressRepository
        .createQueryBuilder('shipping_address')
        .where('shipping_address.customer.id = :customer_id', {
          customer_id: customer.id,
        })
        .getCount();

      const new_address = this.addressRepository.create({
        customer,
        name: addressDto.name,
        phone_number: addressDto.phone_number,
        county,
        town: sub_county_exist,
        area: ward_exist,
        default_address: existing_addresses > 0 ? addressDto.is_default : true,
      });

      await this.addressRepository.save(new_address);

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
      const addresses = await this.addressRepository.find({
        where: { customer: { id: customerId } },
        relations: { county: true, town: true, area: true },
      });

      const shipment_counties = await this.countyRepository.find({
        relations: ['shipmentTowns', 'shipmentTowns.shipment_areas'],
        order: { name: 'ASC' },
      });

      return { addresses, shipment_counties };
    } catch (error) {
      throw new Error(
        'Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.',
      );
    }
  }

  //##########################################
  // ########## UPDATE USER ADDRESS ##########
  //##########################################
  async update(id: number, customerId: number, addressDto: AddressDto) {
    try {
      const address = await this.addressRepository.findOne({
        where: { id, customer: { id: customerId } },
      });

      if (!address) {
        throw new BadRequestException(
          'This address does not exist in our database',
        );
      }

      const county = await this.countyRepository.findOne({
        where: { name: addressDto.county },
        relations: ['shipmentTowns', 'shipmentTowns.shipment_areas'],
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
        await this.addressRepository.update(
          { customer: { id: customerId } },
          { default_address: false },
        );
      }

      await this.addressRepository.update(
        { id },
        {
          name: addressDto.name,
          phone_number: addressDto.phone_number,
          county,
          town: sub_county_exist,
          area: ward_exist,
          default_address: addressDto.is_default,
        },
      );

      return { message: 'address updated successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //##########################################
  // ########## DELETE USER ADDRESS ##########
  //##########################################
  async remove(id: number, customerId: number) {
    try {
      const address = await this.addressRepository.findOne({
        where: { id, customer: { id: customerId } },
        relations: { orders: true },
      });

      for (const order of address.orders) {
        if (['PENDING', 'PROCESSING', 'SHIPPED'].includes(order.status)) {
          throw new NotAcceptableException(
            'This address is asscociates with orders that are not yet completed.',
          );
        }
      }

      await this.addressRepository.remove(address);

      return { message: 'Address successfully deleted' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
