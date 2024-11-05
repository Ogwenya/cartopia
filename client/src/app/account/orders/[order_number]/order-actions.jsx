"use client";

import { useState } from "react";
import SubmitButton from "@/components/ui/submit-button";

const OrderActions = ({ status, access_token }) => {
	const [loading, set_loading] = useState(false);

	const cancel_order = async () => {
		console.log("will implement logic");
	};

	const confirm_order_recieved = async () => {
		console.log("will implement logic");
	};

	return (
		<div>
			{status === "PROCESSING" && (
				<SubmitButton
					className="text-sm"
					variant="destructive"
					loading={loading}
					onClick={cancel_order}
				>
					Cancel Order
				</SubmitButton>
			)}

			{status === "SHIPPED" && (
				<SubmitButton
					className="text-sm"
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
