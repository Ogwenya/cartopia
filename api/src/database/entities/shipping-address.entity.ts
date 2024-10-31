import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { ShipmentCounty } from './shipment-county.entity';
import { ShipmentTown } from './shipment-town.entity';
import { ShipmentArea } from './shipment-area.entity';
import { Order } from './order.entity';

@Entity()
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.shippingAddresses)
  customer: Customer;

  @Column()
  name: string;

  @Column()
  phone_number: string;

  @ManyToOne(() => ShipmentCounty, (county) => county.shippingAddresses)
  county: ShipmentCounty;

  @ManyToOne(() => ShipmentTown, (town) => town.shippingAddresses)
  town: ShipmentTown;

  @ManyToOne(() => ShipmentArea, (area) => area.shippingAddresses)
  area: ShipmentArea;

  @Column({ default: false })
  default_address: boolean;

  @OneToMany(() => Order, (order) => order.shippingAddress)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
