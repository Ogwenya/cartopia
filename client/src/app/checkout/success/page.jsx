import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import calculate_discount from "@/lib/calculate-discounts";
import format_currency from "@/lib/format-currency";
import revalidate_data from "@/app/actions";

async function validate_order(searchParams) {
	const reference = searchParams.reference;
	if (!reference) {
		notFound();
	} else {
		const { access_token } = await getServerSession(authOptions);

		const headers = { Authorization: `Bearer ${access_token}` };

		const API_URL = process.env.NEXT_PUBLIC_API_URL;

		const response = await fetch(
			`${API_URL}/v0/client/orders/confirm/${reference}`,
			{ headers },
		);

		const data = await response.json();

		if (data.error) {
			if (data.message === "Not Found") {
				notFound();
			}
			throw new Error(data.message);
		}

		await revalidate_data("cart");

		return data;
	}
}

const OrderSuccess = async ({ searchParams }) => {
	const order = await validate_order(searchParams);

	return (
		<section>
			<Card className="shadow-none max-w-2xl mx-auto">
				<CardHeader className="text-center">
					<CheckCircledIcon className="w-10 h-10 mx-auto text-success" />
					<CardTitle className="mt-4">
						We received your order!
					</CardTitle>
					<CardDescription className="mt-2">
						Your order #{order.order_number} is being processed.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Separator />
					<div className="py-8">
						{/* customer information */}
						<div className="grid grid-cols-2 gap-x-20 gap-y-8">
							<div className="opacity-80">
								<h3 className="tracking-widest uppercase opacity-80 font-bold text-xs">
									Shipping Information
								</h3>
								<p className="flex flex-col font-medium text-sm mt-6">
									<span className="uppercase font-bold opacity-40 text-xs">
										Name
									</span>
									<span>{order.shippingAddress.name}</span>
								</p>
								<p className="font-medium text-sm mt-6">
									<span className="flex flex-col uppercase font-bold opacity-40 text-xs">
										Phone
									</span>
									<span>
										{order.shippingAddress.phone_number}
									</span>
								</p>
								<p className="flex flex-col font-medium text-sm mt-6">
									<span className="uppercase font-bold opacity-40 text-xs">
										Location
									</span>
									<span>
										{order.shippingAddress.county.name}{" "}
										county,{" "}
										{order.shippingAddress.town.name}{" "}
										sub-county,{" "}
										{order.shippingAddress.area.name}
									</span>
								</p>
							</div>
						</div>
					</div>

					<Separator />

					{/*order items*/}
					<div className="py-8">
						<h3 className="pb-8 tracking-widest uppercase font-bold text-xs opacity-40">
							order items
						</h3>
						{order.items.map((item) => {
							const { after_discount_price } =
								calculate_discount(item);

							return (
								<div
									className="flex py-6 mb-5 border-b"
									key={item.product.id}
								>
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
												<h4 className="text-sm font-medium truncate">
													{item.product.name}
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
								</div>
							);
						})}

						{/*total*/}
						<div className="flex">
							<h6 className="uppercase text-xs font-semibold flex-grow">
								Sub Total
							</h6>
							<span>{format_currency(order.amount)}</span>
						</div>

						<div className="flex">
							<h6 className="uppercase text-xs font-semibold flex-grow">
								Shippment
							</h6>
							<span>{format_currency(order.shipment_fee)}</span>
						</div>
						<div className="flex font-bold">
							<h6 className="uppercase text-xs font-bold flex-grow">
								Total
							</h6>
							<span>
								{format_currency(
									order.amount + order.shipment_fee,
								)}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

export default OrderSuccess;
