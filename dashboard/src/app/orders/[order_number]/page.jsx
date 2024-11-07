import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import format_date from "@/lib/format_date";
import format_currency from "@/lib/format-currency";
import { badge_color } from "@/lib/order-status-color";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import DeleteOrder from "./delete-order";
import UpdateStatus from "./update-status";

export const metadata = {
	title: "Order details",
};

async function getData(order_number) {
	const session = await getServerSession(authOptions);

	const headers = { Authorization: `Bearer ${session.access_token}` };

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v0/admin/orders/${order_number}`,
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

	const overview_data = [
		{ title: "Order Number", value: order.order_number },
		{ title: "Order Date", value: format_date(order.created_at) },
		{
			title: "Order Status",
			value: (
				<Badge className={cn("w-fit", badge_color(order.status))}>
					{order.status}
				</Badge>
			),
		},
	];

	const billing_information = [
		{ title: "Sub Total", value: format_currency(order.amount) },
		{ title: "Shipment Fee", value: format_currency(order.shipment_fee) },
		{
			title: "Total",
			value: format_currency(order.amount + order.shipment_fee),
		},
	];

	const customer_details = [
		{
			title: "Name",
			value: `${order.customer.firstname} ${order.customer.lastname}`,
		},
		{ title: "Email", value: order.customer.email },
		{
			title: "Phone Number",
			value: order.customer.phone_number || (
				<span className="text-destructive">N/A</span>
			),
		},
	];

	const shipping_details = [
		{ title: "Name", value: order.shippingAddress.name },
		{ title: "Phone Number", value: order.shippingAddress.phone_number },
		{ title: "County", value: order.shippingAddress.county.name },
		{ title: "Town", value: order.shippingAddress.town.name },
		{ title: "Area", value: order.shippingAddress.area.name },
	];

	return (
		<section>
			<div className="mb-5 flex items-center justify-between">
				<UpdateStatus
					order_status={order.status}
					order_number={order.order_number}
					access_token={access_token}
				/>
				<DeleteOrder
					order_number={order.order_number}
					access_token={access_token}
				/>
			</div>
			<div className="lg:grid lg:grid-cols-3 gap-4">
				{/*order overview*/}
				<Card className="shadow-none">
					<CardHeader>
						<CardTitle className="text-lg">Order Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="">
							{overview_data.map((entry) => (
								<div
									className="flex flex-col font-medium text-sm mt-6"
									key={entry.title}
								>
									<span className="uppercase font-bold opacity-40">
										{entry.title}
									</span>
									<span>{entry.value}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/*billing info*/}
				<Card className="w-full xl:max-w-md shadow-none">
					<CardHeader>
						<CardTitle className="text-lg">
							Billing Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableBody>
								{billing_information.map((entry) => (
									<TableRow
										className="border-0"
										key={entry.title}
									>
										<TableCell className="font-medium">
											{entry.title}
										</TableCell>
										<TableCell>{entry.value}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				{/*shipping details*/}
				<Card className="w-full xl:max-w-md shadow-none">
					<CardHeader>
						<CardTitle className="text-lg">
							Shipping Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableBody>
								{shipping_details.map((entry) => (
									<TableRow
										className="border-0"
										key={entry.title}
									>
										<TableCell className="font-medium">
											{entry.title}
										</TableCell>
										<TableCell>{entry.value}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<div className="mt-5 flex flex-col xl:flex-row gap-4 min-h-full">
				{/* COLUMN 1 */}
				<div className="w-full xl:max-w-md flex flex-col gap-4 h-min">
					{/*transaction details*/}
					<Card className="shadow-none">
						<CardHeader>
							<CardTitle className="text-lg">
								Transaction Details
							</CardTitle>
						</CardHeader>
						<CardContent>
							{order.transaction_details ? (
								<Table>
									<TableBody>
										{/* phone number */}
										<TableRow className="border-0">
											<TableCell className="font-medium">
												Transaction Reference
											</TableCell>
											<TableCell>
												{
													order.transaction_details
														.reference
												}
											</TableCell>
										</TableRow>
										{/* phone */}
										<TableRow className="border-0">
											<TableCell className="font-medium">
												Amount
											</TableCell>

											<TableCell>
												{format_currency(
													order.transaction_details
														.amount,
												)}
											</TableCell>
										</TableRow>
										{/* date */}
										<TableRow className="border-0">
											<TableCell className="font-medium">
												Payment Date
											</TableCell>
											<TableCell>
												{format_date(
													order.transaction_details
														.transaction_time,
												)}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							) : (
								<CardDescription>
									Order is still pending...
								</CardDescription>
							)}
						</CardContent>
					</Card>

					{/*customer details*/}
					<Card className="shadow-none">
						<CardHeader>
							<CardTitle className="text-lg">
								Customer Details
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableBody>
									{customer_details.map((entry) => (
										<TableRow
											className="border-0"
											key={entry.title}
										>
											<TableCell className="font-medium">
												{entry.title}
											</TableCell>
											<TableCell>{entry.value}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				{/* COLUMN 2 */}
				<div className="flex-1 flex flex-col gap-4">
					{/*order details*/}
					<Card className="shadow-none">
						<CardHeader>
							<CardTitle className="text-lg">
								Order Items
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<ul
									role="list"
									className="border-b border-t border-muted list-none divide-y"
								>
									{order.items.map((item) => {
										const { after_discount_price } =
											calculate_discount(item);

										return (
											<li
												className="flex py-6"
												key={item.id}
											>
												{/* product image */}
												<Card className="h-24 w-24 flex items-center justify-center shadow-none">
													<img
														src={item.product_image}
														alt={item.product_image}
														className="aspect-auto max-w-[80%]"
													/>
												</Card>

												<div className="ml-4 flex flex-1 flex-col md:ml-6 overflow-hidden">
													<div>
														<div className="flex justify-between">
															<h4 className="text-sm max-md:truncate font-medium">
																{
																	item.product_name
																}
															</h4>

															<p className="ml-6 text-sm font-medium">
																{format_currency(
																	item.quantity *
																		after_discount_price,
																)}
															</p>
														</div>

														<CardDescription className="mt-1">
															{format_currency(
																after_discount_price,
															)}
														</CardDescription>
													</div>

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
					</Card>
				</div>
			</div>
		</section>
	);
};

function calculate_discount(item) {
	let discount_amount = 0;

	if (item.discount_type === "NONE") {
		discount_amount = 0;
	} else if (item.discount_type === "Amount") {
		discount_amount = item.discount;
	} else {
		discount_amount = (item.discount / 100) * item.price;
	}
	const after_discount_price = item.price - discount_amount;

	return { discount_amount, after_discount_price };
}

export default OrderDetails;
