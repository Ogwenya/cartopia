import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Campaign } from './entities/campaign.entity';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';
import { Category } from './entities/category.entity';
import { Customer } from './entities/customer.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ShipmentArea } from './entities/shipment-area.entity';
import { ShipmentCounty } from './entities/shipment-county.entity';
import { ShipmentTown } from './entities/shipment-town.entity';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Transaction } from './entities/transaction.entity';
import { User } from './entities/user.entity';

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: () => ({
				type: 'mysql',
				host: process.env.DATABASE_HOST,
				port: Number(process.env.DATABASE_PORT),
				username: process.env.DATABASE_USER,
				password: process.env.DATABASE_PASSWORD,
				database: process.env.DATABASE_NAME,
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				autoLoadEntities: true,
				synchronize: true,
			}),
		}),

		TypeOrmModule.forFeature([
			Brand,
			Campaign,
			CartItem,
			Cart,
			Category,
			Customer,
			OrderItem,
			Order,
			ProductImage,
			Product,
			ShipmentArea,
			ShipmentCounty,
			ShipmentTown,
			ShippingAddress,
			Transaction,
			User,
		]),
	],

	exports: [TypeOrmModule],
})
export class DatabaseModule {}
