import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function fetch_cart() {
	const { access_token } = await getServerSession(authOptions);

	try {
		const headers = {
			Authorization: `Bearer ${access_token}`,
		};
		const API_URL = process.env.NEXT_PUBLIC_API_URL;

		const response = await fetch(`${API_URL}/v0/client/cart`, {
			headers: headers,
			next: { tags: ["cart"] },
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

const CartDetails = async () => {
	const data = await fetch_cart();

	console.log(data);

	return <p>Cart Page</p>;
};

export default CartDetails;
