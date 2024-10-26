import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrdersCards from "@/components/account/orders.cards";

const OrdersTabs = ({ orders }) => {
	return (
		<section className="h-full">
			<Tabs defaultValue="PENDING" className="md:w-full h-full">
				<TabsList className="w-full max-w-full justify-between items-stretch overflow-x-scroll">
					<TabsTrigger
						value="PENDING"
						className="w-full max-md:text-xs"
					>
						PENDING
					</TabsTrigger>
					<TabsTrigger
						value="PROCESSING"
						className="w-full max-md:text-xs"
					>
						PROCESSING
					</TabsTrigger>
					<TabsTrigger
						value="SHIPPED"
						className="w-full max-md:text-xs"
					>
						SHIPPED
					</TabsTrigger>
					<TabsTrigger
						value="COMPLETED"
						className="w-full max-md:text-xs"
					>
						COMPLETED
					</TabsTrigger>
					<TabsTrigger
						value="CANCELED"
						className="w-full max-md:text-xs"
					>
						CANCELED
					</TabsTrigger>
				</TabsList>
				<TabsContent value="PENDING" className="h-full">
					<OrdersCards
						orders={orders.filter(
							(order) => order.status === "PENDING",
						)}
					/>
				</TabsContent>
				<TabsContent value="PROCESSING" className="h-full">
					<OrdersCards
						orders={orders.filter(
							(order) => order.status === "PROCESSING",
						)}
					/>
				</TabsContent>
				<TabsContent value="SHIPPED" className="h-full">
					<OrdersCards
						orders={orders.filter(
							(order) => order.status === "SHIPPED",
						)}
					/>
				</TabsContent>
				<TabsContent value="COMPLETED" className="h-full">
					<OrdersCards
						orders={orders.filter(
							(order) => order.status === "COMPLETED",
						)}
					/>
				</TabsContent>
				<TabsContent value="CANCELED" className="h-full">
					<OrdersCards
						orders={orders.filter(
							(order) => order.status === "CANCELED",
						)}
					/>
				</TabsContent>
			</Tabs>
		</section>
	);
};

export default OrdersTabs;
