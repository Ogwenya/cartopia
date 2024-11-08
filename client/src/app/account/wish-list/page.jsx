import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CardDescription } from "@/components/ui/card";
import { Heart } from "lucide-react";
import ProductCard from "@/components/product-card";

export const metadata = {
	title: "Wish List",
};

async function getData() {
	const { access_token } = await getServerSession(authOptions);

	const headers = {
		Authorization: `Bearer ${access_token}`,
	};
	const API_URL = process.env.NEXT_PUBLIC_API_URL;

	const response = await fetch(`${API_URL}/v0/client/wishlist`, {
		headers: headers,
		next: { tags: ["wishlist"] },
	});

	const data = await response.json();

	if (data.error) {
		throw new Error(data.message);
	}

	return data;
}

const WishList = async () => {
	const wishlist = await getData();

	return (
		<section className="h-full">
			{wishlist.length > 0 ? (
				<div className="grid max-sm:grid-cols-2 grid-cols-[repeat(auto-fill,minmax(185px,1fr))] max-md:gap-1 gap-2">
					{wishlist.map((item) => (
						<ProductCard
							product={item.product}
							show_cart_buttons={false}
							key={item.id}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<CardDescription>
						<Heart className="size-20 opacity-25" />
					</CardDescription>

					<CardDescription className="mt-4 opacity-50">
						Your wish list is empty
					</CardDescription>
				</div>
			)}
		</section>
	);
};

export default WishList;
