import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import OrderSummary from "./order-summary";
import ShippinInformation from "./shipping-info";
import ProcessPayment from "./payment";
import Checkout from "./checkout";
import calculate_discount from "@/lib/calculate-discounts";

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

	const { cart, shipping_addresses, shipment_counties } = data;

	const sub_total =
		cart.items.reduce((totalPrice, item) => {
			const { after_discount_price } = calculate_discount(item.product);

			return totalPrice + item.quantity * after_discount_price;
		}, 0) || 0;

	return (
		<section>
			<div className="max-lg:space-y-5 lg:grid lg:grid-cols-2 lg:gap-4">
				<Checkout
					shipping_addresses={shipping_addresses}
					access_token={access_token}
					shipment_counties={shipment_counties}
					sub_total={sub_total}
				/>

				<OrderSummary items={cart.items} sub_total={sub_total} />
			</div>
		</section>
	);
};

export default CheckoutPage;
