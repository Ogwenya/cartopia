"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import update_cart from "@/lib/update-cart";
import ChangeCartQuantityButtons from "@/components/change-cart-quantity-buttons";

const CartButtons = ({ item, access_token }) => {
	const { toast } = useToast();
	return (
		<div className="mt-4 flex flex-1 items-end justify-between">
			<ChangeCartQuantityButtons
				product={item.product}
				quantity={item.quantity}
				access_token={access_token}
				className="text-sm text-primary/80"
			/>

			<div className="ml-4">
				<Button
					size="sm"
					variant="ghost"
					onClick={() =>
						update_cart({
							operation: "delete",
							product: item.product,
							toast,
							access_token,
						})
					}
				>
					<TrashIcon className="w-5 h-5 text-destructive" />
				</Button>
			</div>
		</div>
	);
};

export default CartButtons;
