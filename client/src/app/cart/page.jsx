import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import calculate_discount from "@/lib/calculate-discounts";
import CartButtons from "./cart-buttons";

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

		return { data, access_token };
	} catch (error) {
		throw new Error(
			"Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.",
		);
	}
}

const EmptyCart = () => {
	return (
		<>
			<CardHeader className="text-xl text-center">
				Your cart is empty
			</CardHeader>

			<CardContent className="">
				{/* empty cart icon */}
				<svg
					className="h-48 mb-10 mx-auto text-muted"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M3.04047 2.29242C2.6497 2.15503 2.22155 2.36044 2.08416 2.7512C1.94678 3.14197 2.15218 3.57012 2.54295 3.7075L2.80416 3.79934C3.47177 4.03406 3.91052 4.18961 4.23336 4.34802C4.53659 4.4968 4.67026 4.61723 4.75832 4.74609C4.84858 4.87818 4.91828 5.0596 4.95761 5.42295C4.99877 5.80316 4.99979 6.29837 4.99979 7.03832L4.99979 9.64C4.99979 12.5816 5.06302 13.5523 5.92943 14.4662C6.79583 15.38 8.19028 15.38 10.9792 15.38H16.2821C17.8431 15.38 18.6236 15.38 19.1753 14.9304C19.727 14.4808 19.8846 13.7164 20.1997 12.1875L20.6995 9.76275C21.0466 8.02369 21.2202 7.15417 20.7762 6.57708C20.3323 6 18.8155 6 17.1305 6H6.49233C6.48564 5.72967 6.47295 5.48373 6.4489 5.26153C6.39517 4.76515 6.27875 4.31243 5.99677 3.89979C5.71259 3.48393 5.33474 3.21759 4.89411 3.00139C4.48203 2.79919 3.95839 2.61511 3.34187 2.39838L3.04047 2.29242ZM10.9697 8.96967C11.2626 8.67678 11.7374 8.67678 12.0303 8.96967L13 9.93934L13.9697 8.96967C14.2626 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L14.0607 11L15.0303 11.9697C15.3232 12.2626 15.3232 12.7374 15.0303 13.0303C14.7374 13.3232 14.2626 13.3232 13.9697 13.0303L13 12.0607L12.0303 13.0303C11.7374 13.3232 11.2626 13.3232 10.9697 13.0303C10.6768 12.7374 10.6768 12.2626 10.9697 11.9697L11.9393 11L10.9697 10.0303C10.6768 9.73744 10.6768 9.26256 10.9697 8.96967Z"
						fill="currentColor"
					/>
					<path
						d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
						fill="currentColor"
					/>
					<path
						d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
						fill="currentColor"
					/>
				</svg>

				<Button className="w-full transition-all duration-200" asChild>
					<Link href="/">
						<ArrowLeftIcon className="mr-2 size-4" />
						Continue Shopping
					</Link>
				</Button>
			</CardContent>
			<div className="flex flex-col items-center"></div>
		</>
	);
};

const CartDetails = async () => {
	const { data, access_token } = await fetch_cart();

	const totalPrice =
		data.items.reduce((totalPrice, item) => {
			const { after_discount_price } = calculate_discount(item.product);

			return totalPrice + item.quantity * after_discount_price;
		}, 0) || 0;

	return (
		<section>
			<Card className={`mx-auto max-w-3xl my-10`}>
				{data.items.length > 0 ? (
					<>
						<CardHeader>
							<CardTitle className="text-center text-3xl">
								Your Cart
							</CardTitle>
						</CardHeader>

						<CardContent className="mt-8">
							<ul
								role="list"
								className="border-b border-t border-muted list-none divide-y"
							>
								{data.items.map((item) => {
									const { after_discount_price } =
										calculate_discount(item.product);

									return (
										<li className="flex py-6" key={item.id}>
											<Card className="h-24 w-24 md:h-32 md:w-32 flex items-center justify-center shadow-none">
												<img
													src={
														item.product.images[0]
															.image_url
													}
													alt={item.product.name}
													className="aspect-auto max-w-[80%]"
												/>
											</Card>

											<div className="ml-4 flex flex-1 flex-col md:ml-6 overflow-hidden">
												<div>
													<div className="flex justify-between">
														<h4 className="text-sm max-md:truncate">
															<Link
																href={`/${item.product.slug}`}
																className="font-medium text-primary/80"
															>
																{
																	item.product
																		.name
																}
															</Link>
														</h4>

														<p className="ml-6 text-sm font-medium text-primary">
															{(
																item.quantity *
																after_discount_price
															).toLocaleString(
																"en-US",
																{
																	style: "currency",
																	currency:
																		"KES",
																},
															)}
														</p>
													</div>

													<CardDescription className="mt-1">
														{after_discount_price.toLocaleString(
															"en-US",
															{
																style: "currency",
																currency: "KES",
															},
														)}
													</CardDescription>
												</div>

												<CartButtons
													item={item}
													access_token={access_token}
												/>
											</div>
										</li>
									);
								})}
							</ul>
						</CardContent>

						<CardFooter className="flex-col">
							<div className="w-full">
								<p className="flex items-center justify-between">
									<span className="text-base font-medium text-primary">
										Subtotal
									</span>
									<span className="ml-4 text-base font-medium text-primary">
										{totalPrice.toLocaleString("en-US", {
											style: "currency",
											currency: "KES",
										})}
									</span>
								</p>
								<CardDescription className="mt-1 text-center">
									Shipping and taxes will be calculated at
									checkout.
								</CardDescription>
							</div>

							<Button className="mt-10 w-full" asChild>
								<Link href="/checkout">Checkout</Link>
							</Button>

							<div className="mt-6 text-center text-sm">
								<p>
									or {""}
									<Link
										href="/"
										className="inline-flex items-center gap-x-1 font-medium text-indigo-600"
									>
										<span className="h-fit">
											Continue Shopping
										</span>

										<ArrowRightIcon />
									</Link>
								</p>
							</div>
						</CardFooter>
					</>
				) : (
					<EmptyCart />
				)}
			</Card>
		</section>
	);
};

export default CartDetails;
