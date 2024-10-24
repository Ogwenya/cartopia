import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import calculate_discount from "@/lib/calculate-discounts";
import Link from "next/link";

const OrderSummary = ({ items }) => {
	const sub_total =
		items.reduce((totalPrice, item) => {
			const { after_discount_price } = calculate_discount(item.product);

			return totalPrice + item.quantity * after_discount_price;
		}, 0) || 0;

	const shipment_fees = 0;

	return (
		<Card className="mx-auto max-w-3xl">
			<CardHeader>
				<CardTitle>Order Summary</CardTitle>
			</CardHeader>

			<CardContent className="mt-8">
				<div>
					<ul
						role="list"
						className="border-b border-t border-muted list-none divide-y"
					>
						{items.map((item) => {
							const { after_discount_price } = calculate_discount(
								item.product,
							);

							return (
								<li className="flex py-6" key={item.product.id}>
									{/* product image */}
									<Card className="h-24 w-24 md:h-32 md:w-32 flex items-center justify-center shadow-none">
										<img
											src={
												item.product.images[0].image_url
											}
											alt={item.product.name}
											className="aspect-auto max-w-[80%]"
										/>
									</Card>

									<div className="ml-4 flex flex-1 flex-col md:ml-6 overflow-hidden">
										<div>
											{/* product name and price */}
											<div className="flex justify-between">
												<h4 className="text-sm max-md:truncate">
													<Link
														href={`/${item.product.slug}`}
														className="font-medium text-primary/80"
													>
														{item.product.name}
													</Link>
												</h4>

												{/* total price (product * quantity) */}
												<p className="ml-6 text-sm font-medium text-primary">
													{(
														item.quantity *
														after_discount_price
													).toLocaleString("en-US", {
														style: "currency",
														currency: "KES",
													})}
												</p>
											</div>

											{/* price per product */}
											<CardDescription className="mt-1">
												{after_discount_price.toLocaleString(
													"en-US",
													{
														style: "currency",
														currency: "KES",
													},
												)}
											</CardDescription>
										</div>

										{/* quantity */}
										<CardDescription className="flex-1 flex items-end">
											QTY {item.quantity}
										</CardDescription>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</CardContent>

			<CardFooter className="flex-col space-y-2.5">
				<p className="w-full flex items-center justify-between">
					<span className="text-base font-medium text-primary">
						Subtotal
					</span>
					<span className="ml-4 text-base font-medium text-primary">
						{sub_total.toLocaleString("en-US", {
							style: "currency",
							currency: "KES",
						})}
					</span>
				</p>

				{/* shipment fees */}
				<p className="w-full flex items-center justify-between">
					<span className="text-base font-medium text-primary">
						Shipment
					</span>
					<span className="ml-4 text-base font-medium text-primary">
						{shipment_fees.toLocaleString("en-US", {
							style: "currency",
							currency: "KES",
						})}
					</span>
				</p>

				{/* total */}
				<p className="w-full flex items-center justify-between">
					<span className="text-base font-bold text-primary">
						Total
					</span>
					<span className="ml-4 text-base font-bold text-primary">
						{(sub_total + shipment_fees).toLocaleString("en-US", {
							style: "currency",
							currency: "KES",
						})}
					</span>
				</p>
			</CardFooter>
		</Card>
	);
};

export default OrderSummary;
