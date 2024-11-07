"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/ui/submit-button";
import { toast } from "@/hooks/use-toast";

const OrderActions = ({ status, order_number, access_token }) => {
	const [loading, set_loading] = useState(false);
	const router = useRouter();

	const send_request = async (url) => {
		try {
			set_loading(true);
			const res = await fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			});

			const result = await res.json();

			set_loading(false);

			if (result.error) {
				toast({
					variant: "destructive",
					title: "Error",
					description: Array.isArray(result.message)
						? result.message[0]
						: result.message,
				});
			} else {
				toast({
					variant: "success",
					title: "Success",
					description: result.message,
				});

				router.refresh();
			}
		} catch (error) {
			set_loading(false);
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message,
			});
		}
	};

	const cancel_order = async () => {
		await send_request(
			`${process.env.NEXT_PUBLIC_API_URL}/v0/client/orders/cancel/${order_number}`,
		);
	};

	const confirm_order_recieved = async () => {
		await send_request(
			`${process.env.NEXT_PUBLIC_API_URL}/v0/client/orders/complete/${order_number}`,
		);
	};

	return (
		<div>
			{status === "PROCESSING" && (
				<SubmitButton
					className="text-sm"
					variant="destructive"
					size="sm"
					loading={loading}
					onClick={cancel_order}
				>
					Cancel Order
				</SubmitButton>
			)}

			{status === "SHIPPED" && (
				<SubmitButton
					className="text-sm"
					size="sm"
					loading={loading}
					onClick={confirm_order_recieved}
				>
					Confirm Order Received
				</SubmitButton>
			)}
		</div>
	);
};

export default OrderActions;
