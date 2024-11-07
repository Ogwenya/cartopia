import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "src/database/entities/order.entity";

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
