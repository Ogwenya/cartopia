import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Badge } from "@/components/ui/badge";
import calculate_discount from "@/lib/calculate-discounts";
import ProductImagesCarousel from "./product-images-carousel";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ChangeCartQuantityButtons from "@/components/change-cart-quantity-buttons";
import AddToCartButton from "@/components/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import WishlistControl from "./wishlist-control";

export async function generateMetadata({ params, searchParams }, parent) {
	const product = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v0/client/products/${params.slug}`,
		{
			headers: {
				"X-API-KEY": process.env.API_KEY,
			},
		},
	).then((res) => res.json());

	return {
		title: `Cartopia | ${product.name}`,
		openGraph: {
			title: `Cartopia | ${product.name}`,
		},
	};
}

async function getData(slug) {
	const session = await getServerSession(authOptions);

	const headers = session
		? { Authorization: `Bearer ${session.access_token}` }
		: { "X-API-KEY": process.env.API_KEY };

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/v0/client/products/${slug}`,
		{ headers },
	);

	const product = await response.json();

	if (product.error) {
		if (product.message === "Not Found") {
			notFound();
		}

		throw new Error(product.message);
	}

	return { product, access_token: session ? session.access_token : null };
}

const productDetails = async ({ params }) => {
	const { product, access_token } = await getData(params.slug);

	const { after_discount_price } = calculate_discount(product);

	const quantity_in_cart =
		product.cart_items && product.cart_items.length > 0
			? product.cart_items[0].quantity
			: 0;

	return (
		<section className="min-h-screen max-w-5xl mx-auto py-12 px-4 bg-white">
			<div className="grid md:grid-cols-2 gap-10 mb-16 lg:px-12">
				<div className="h-full max-w-full">
					<ProductImagesCarousel images={product.images} />
				</div>

				<div className="h-full">
					<h3 className="mb-4 text-xl opacity-80">{product.name}</h3>

					<div className="flex gap-3 mb-4">
						<Badge variant="outline">
							<Link href={`/brands/${product.brand.slug}`}>
								{product.brand.name}
							</Link>
						</Badge>

						<Badge variant="outline">
							<Link href={`/categories/${product.category.slug}`}>
								{product.category.name}
							</Link>
						</Badge>
					</div>

					{/* product price */}
					<div className="mb-10 flex items-center">
						<span className="text-2xl font-medium text-heading md:text-3xl">
							{new Intl.NumberFormat("en-US", {
								style: "currency",
								currency: "KES",
							}).format(after_discount_price)}
						</span>

						{product.discount_value > 0 && (
							<>
								<del className="text-md opacity-50 ml-2 md:text-lg">
									{new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: "KES",
									}).format(product.price)}
								</del>

								<Badge
									variant="destructive"
									className="hidden sm:block md:hidden lg:block ml-2"
								>
									{product.discount_type === "Amount"
										? `KES ${product.discount_value}`
										: `${product.discount_value}%`}{" "}
									OFF
								</Badge>
							</>
						)}
					</div>

					{/*cart buttons*/}
					<div className="flex items-center gap-4">
						{quantity_in_cart > 0 ? (
							<ChangeCartQuantityButtons
								product={product}
								quantity={quantity_in_cart}
								access_token={access_token}
							/>
						) : (
							<div className="w-full">
								<AddToCartButton
									product={product}
									className="w-full max-w-md"
								/>
							</div>
						)}

						<WishlistControl
							quantity_in_cart={quantity_in_cart}
							wishlist={product.wishlist}
							access_token={access_token}
							product_id={product.id}
						/>
					</div>
				</div>
			</div>

			<div className="prose">
				<h3>Product Description</h3>

				<div
					dangerouslySetInnerHTML={{
						__html: product.description,
					}}
				></div>
			</div>
		</section>
	);
};

export default productDetails;
