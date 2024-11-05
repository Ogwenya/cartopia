import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import calculate_discount from "@/lib/calculate-discounts";
import format_currency from "@/lib/format-currency";

const OrderSummary = ({ items, sub_total }) => {
	return (
		<Card className="w-full mx-auto max-w-3xl">
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
									<Card className="h-24 w-24 flex items-center justify-center shadow-none">
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
											<div className="flex justify-between w-full">
												<h4 className="text-sm truncate">
													<Link
														href={`/${item.product.slug}`}
														className="font-medium"
													>
														{item.product.name}
													</Link>
												</h4>

												{/* total price (product * quantity) */}
												<p className="ml-6 text-sm font-medium">
													{format_currency(
														item.quantity *
															after_discount_price,
													)}
												</p>
											</div>

											{/* price per product */}
											<CardDescription className="mt-1">
												{format_currency(
													after_discount_price,
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

			<CardFooter>
				<p className="w-full flex items-center justify-between text-base font-medium">
					<span>Subtotal</span>
					<span className="ml-4">{format_currency(sub_total)}</span>
				</p>
			</CardFooter>
		</Card>
	);
};

export default OrderSummary;
