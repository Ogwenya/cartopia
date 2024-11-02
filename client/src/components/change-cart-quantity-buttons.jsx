"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import update_cart from "@/lib/update-cart";
import { Button } from "@/components/ui/button";

const ChangeCartQuantityButtons = ({
	product,
	quantity,
	access_token,
	className,
}) => {
	const { toast } = useToast();

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<Button
				size="sm"
				variant="outline"
				className="h-5 w-5 p-2 md:h-6 md:w-6 md:p-1"
				onClick={() =>
					update_cart({
						operation: "remove",
						product,
						toast,
						access_token,
					})
				}
				disabled={quantity < 2}
			>
				<MinusIcon />
			</Button>
			<span>{quantity}</span>
			<Button
				size="sm"
				variant="outline"
				className="h-5 w-5 p-2 md:h-6 md:w-6 md:p-1"
				onClick={() =>
					update_cart({
						operation: "add",
						product,
						toast,
						access_token,
					})
				}
			>
				<PlusIcon />
			</Button>
		</div>
	);
};

export default ChangeCartQuantityButtons;
