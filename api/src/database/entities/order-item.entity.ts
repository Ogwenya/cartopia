import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { DiscountType, Product } from './product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  discount: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'varchar', length: 50, enum: DiscountType })
  discount_type: DiscountType;

  @ManyToOne(() => Product, (product) => product.orderItem)
  product: Product;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column()
  product_name: string;

  @Column()
  product_image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
