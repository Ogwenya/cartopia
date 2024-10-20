import revalidate_data from "@/app/actions";

export default async function update_cart(payload) {
	const { operation, product, toast, access_token } = payload;
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/v0/client/cart`,
			{
				method: "PATCH",
				body: JSON.stringify({ operation, product_id: product.id }),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			},
		);

		const result = await response.json();

		if (result.error) {
			toast({
				variant: "destructive",
				title: "An Error Occured",
				description: result.message,
			});
		}
		await revalidate_data("cart");
	} catch (error) {
		toast({
			variant: "destructive",
			title: "An Error Occured",
			description: error.message,
		});
	}
}
