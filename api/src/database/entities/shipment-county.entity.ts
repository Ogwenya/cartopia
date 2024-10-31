import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { ShipmentTown } from './shipment-town.entity';

@Entity()
export class ShipmentCounty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ShipmentTown, (town) => town.county, { cascade: true })
  shipmentTowns: ShipmentTown[];

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => ShippingAddress, (address) => address.county)
  shippingAddresses: ShippingAddress[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
