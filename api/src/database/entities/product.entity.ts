import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
import { Wishlist } from './wish-list.entity';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum DiscountType {
  NONE = 'NONE',
  Percentage = 'Percentage',
  Amount = 'Amount',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'enum', enum: DiscountType, default: DiscountType.NONE })
  discount_type: DiscountType;

  @Column({ type: 'float', default: 0 })
  discount_value: number;

  @Column({ default: 0 })
  in_stock: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItem: OrderItem[];

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cart_items: CartItem[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
