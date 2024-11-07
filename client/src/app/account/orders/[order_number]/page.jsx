import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Card, CardDescription } from "@/components/ui/card";
import calculate_discount from "@/lib/calculate-discounts";
import format_currency from "@/lib/format-currency";
import format_date from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";
import { badge_color } from "@/components/account/order-status-colors";
import OrderActions from "./order-actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
	title: "Order details",
};

async function getData(order_number) {
	const session = await getServerSession(authOptions);

	const headers = { Authorization: `Bearer ${session.access_token}` };

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v0/client/orders/${order_number}`,
		{ headers },
	);

	const order = await response.json();

	if (order.error) {
		if (order.message === "Not Found") {
			notFound();
		}

		throw new Error(order.message);
	}

	return { order, access_token: session.access_token };
}

const OrderDetails = async ({ params }) => {
	const { order, access_token } = await getData(params.order_number);

	const shipping_details = [
		{ title: "Name", value: order.shippingAddress.name },
		{ title: "Phone Number", value: order.shippingAddress.phone_number },
		{ title: "County", value: order.shippingAddress.county.name },
		{ title: "Sub-County/Town", value: order.shippingAddress.town.name },
		{ title: "Ward/Area", value: order.shippingAddress.area.name },
	];

	const order_details = [
		{ title: "Order Number", value: order.order_number },
		{ title: "Order Time", value: format_date(order.created_at) },
		{
			title: "Payment Time",
			value: order.transaction_details?.transaction_time
				? format_date(order.transaction_details.transaction_time)
				: "N/A",
		},
		{ title: "Order Amount", value: format_currency(order.amount) },
		{ title: "Shipping Fee", value: format_currency(order.shipment_fee) },
		{
			title: "Total Amount",
			value: format_currency(order.amount + order.shipment_fee),
		},
	];

	if (order.status === "SHIPPED" || order.status === "COMPLETED") {
		order_details.splice(3, 0, {
			title: "Shipped Date",
			value:
				order.status === "SHIPPED" || order.status === "COMPLETED"
					? format_date(order.shipped_out_date)
					: "N/A",
		});
	}

	return (
		<section className="space-y-5">
			<div className="flex items-center justify-between">
				<Badge className={badge_color(order.status)}>
					{order.status}
				</Badge>

				<OrderActions
					status={order.status}
					access_token={access_token}
					order_number={order.order_number}
				/>
			</div>
			<div>
				<ul role="list" className="rounded-md border p-4 list-none">
					{order.items.map((item) => {
						const { after_discount_price } = calculate_discount(
							item.product,
						);

						return (
							<li className="flex py-6" key={item.product.id}>
								{/* product image */}
								<Card className="h-24 w-24 bg-gray-50 flex items-center justify-center shadow-none">
									<img
										src={item.product.images[0].image_url}
										alt={item.product.name}
										className="aspect-auto bg-transparent mix-blend-multiply"
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

			<div className=" rounded-md border p-4 space-y-5">
				{order_details.map((entry, index) => (
					<div
						key={index}
						className="flex max-md:flex-col max-md:gap-y-1 md:justify-between text-sm text-muted-foreground"
					>
						<span className="max-md:font-semibold md:font-medium">
							{entry.title}
						</span>
						<span>{entry.value}</span>
					</div>
				))}
			</div>

			<div className=" flex items-center space-x-4 rounded-md border p-4">
				<div className="flex-1 space-y-1">
					<p className="text-sm font-medium leading-none">
						Shipping Information
					</p>
					<div className="pt-3 space-y-5">
						{shipping_details.map((entry, index) => (
							<div
								key={index}
								className="flex max-md:flex-col max-md:gap-y-1 md:justify-between text-sm text-muted-foreground"
							>
								<span className="max-md:font-semibold md:font-medium">
									{entry.title}
								</span>
								<span>{entry.value}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default OrderDetails;
