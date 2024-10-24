import { getServerSession } from "next-auth";
import { MapPin } from "lucide-react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import OrderSummary from "./order-summary";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
	title: "Checkout",
};

async function getData() {
	const { access_token } = await getServerSession(authOptions);

	try {
		const headers = {
			Authorization: `Bearer ${access_token}`,
		};
		const API_URL = process.env.NEXT_PUBLIC_API_URL;

		const response = await fetch(`${API_URL}/v0/client/cart/checkout`, {
			headers: headers,
		});

		const data = await response.json();

		if (data.error) {
			throw new Error(data.message);
		}

		return { data, access_token };
	} catch (error) {
		throw new Error(
			"Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.",
		);
	}
}

const CheckoutPage = async () => {
	const { data, access_token } = await getData();

	const { cart, shipping_addresses } = data;

	console.log(shipping_addresses);

	return (
		<section>
			<div className="grid md:grid-cols-2 gap-4">
				<div>
					<Card>
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle>Shipping Information</CardTitle>

								<Link href="/account/addresses">
									<Button>Add</Button>
								</Link>
							</div>
						</CardHeader>

						<CardContent className="space-y-2">
							{shipping_addresses.length > 0 ? (
								<>
									<CardDescription>
										Jason Bourne
									</CardDescription>
									<CardDescription>
										0703959541
									</CardDescription>
									<CardDescription>
										jason@email.com
									</CardDescription>
									<CardDescription className="flex gap-2">
										<MapPin className="w-10" />
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Quae velit officiis
										suscipit accusamus, temporibus esse non
										consequatur voluptatum, obcaecati animi,
										id cum nulla, adipisci modi qui dolore
										laboriosam? Rerum, enim?
									</CardDescription>
								</>
							) : (
								<>
									<CardDescription>
										No addresses saved
									</CardDescription>
								</>
							)}
						</CardContent>
					</Card>

					<div>Payment form</div>
				</div>

				<div>
					<OrderSummary items={cart.items} />
				</div>
			</div>
		</section>
	);
};

export default CheckoutPage;
