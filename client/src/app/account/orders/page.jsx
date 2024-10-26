import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OrdersTabs from "./orders-tabs";

export const metadata = {
	title: "Orders",
};

async function getData() {
	const { access_token } = await getServerSession(authOptions);

	try {
		const headers = {
			Authorization: `Bearer ${access_token}`,
		};
		const API_URL = process.env.NEXT_PUBLIC_API_URL;

		const response = await fetch(`${API_URL}/v0/client/orders`, {
			headers: headers,
			next: { tags: ["orders"] },
		});

		const data = await response.json();

		if (data.error) {
			throw new Error(data.message);
		}

		return data;
	} catch (error) {
		throw new Error(
			"Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.",
		);
	}
}

const CustomerOrders = async () => {
	const orders = await getData();

	return <OrdersTabs orders={orders} />;
};

export default CustomerOrders;
