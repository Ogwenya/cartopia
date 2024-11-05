"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import SubmitButton from "@/components/ui/submit-button";
import { toast } from "@/hooks/use-toast";
import format_currency from "@/lib/format-currency";

const MakePayment = ({
	sub_total,
	access_token,
	shipment_fees,
	address_id,
}) => {
	const [loading, set_loading] = useState(false);

	const place_order = async () => {
		try {
			set_loading(true);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v0/client/orders`,
				{
					method: "POST",
					body: JSON.stringify({ address_id }),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${access_token}`,
					},
				},
			);

			set_loading(false);

			const result = await response.json();

			if (result.error) {
				toast({
					variant: "destructive",
					title: "An Error Occured",
					description: result.message,
				});
			} else {
				window.location.assign(result.authorization_url);
			}
		} catch (error) {
			set_loading(false);
			toast({
				variant: "destructive",
				title: "An Error Occured",
				description: error.message,
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Proceed To Payment</CardTitle>
			</CardHeader>
			<CardContent className="flex-col space-y-2.5">
				<p className="w-full flex items-center justify-between text-base font-medium">
					<span>Subtotal</span>
					<span className="ml-4">{format_currency(sub_total)}</span>
				</p>

				{/* shipment fees */}
				<p className="w-full flex items-center justify-between text-base font-medium">
					<span>Shipment</span>
					<span className="ml-4">
						{format_currency(shipment_fees)}
					</span>
				</p>

				{/* total */}
				<p className="w-full flex items-center justify-between text-base font-bold">
					<span>Total</span>
					<span className="ml-4">
						{format_currency(sub_total + shipment_fees)}
					</span>
				</p>
			</CardContent>

			<CardFooter>
				<SubmitButton
					className="w-full"
					loading={loading}
					onClick={place_order}
				>
					Place Order
				</SubmitButton>
			</CardFooter>
		</Card>
	);
};

export default MakePayment;
