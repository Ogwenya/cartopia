import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import OrderSummary from "./order-summary";
import ShippinInformation from "./shipping-info";

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

	return (
		<section>
			<div className="max-lg:space-y-5 lg:grid lg:grid-cols-2 lg:gap-4">
				<div>
					<ShippinInformation
						shipping_addresses={shipping_addresses}
					/>

					<div>Payment form</div>
				</div>

				<OrderSummary items={cart.items} />
			</div>
		</section>
	);
};

export default CheckoutPage;
