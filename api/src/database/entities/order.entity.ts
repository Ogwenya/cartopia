import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';
import { Transaction } from './transaction.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  order_number: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  shipment_fee: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  shipped_out_date: Date;

  @ManyToOne(() => ShippingAddress, (address) => address.orders)
  shippingAddress: ShippingAddress;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction_details: Transaction;

  @Column({ nullable: true, unique: true })
  transaction_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
