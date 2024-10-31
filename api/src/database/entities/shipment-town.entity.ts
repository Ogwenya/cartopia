import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ShipmentCounty } from './shipment-county.entity';
import { ShippingAddress } from './shipping-address.entity';
import { ShipmentArea } from './shipment-area.entity';

@Entity()
export class ShipmentTown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => ShipmentCounty, (county) => county.shipmentTowns)
  county: ShipmentCounty;

  @OneToMany(() => ShipmentArea, (area) => area.town, { cascade: true })
  shipment_areas: ShipmentArea[];

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => ShippingAddress, (address) => address.town)
  shippingAddresses: ShippingAddress[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
