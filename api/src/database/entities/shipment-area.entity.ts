import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ShipmentTown } from './shipment-town.entity';
import { ShippingAddress } from './shipping-address.entity';

@Entity()
export class ShipmentArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float', default: 0 })
  fees: number;

  @ManyToOne(() => ShipmentTown, (town) => town.shipment_areas)
  town: ShipmentTown;

  @Column()
  townId: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => ShippingAddress, (address) => address.area)
  shippingAddresses: ShippingAddress[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
