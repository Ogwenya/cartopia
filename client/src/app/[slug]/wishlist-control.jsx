"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const WishlistControl = ({
	quantity_in_cart,
	wishlist,
	access_token,
	product_id,
}) => {
	const router = useRouter();

	const toggle_wishlist = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v0/client/wishlist`,
				{
					method: "PATCH",
					body: JSON.stringify({ product_id }),
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

			router.refresh();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "An Error Occured",
				description: error.message,
			});
		}
	};

	return (
		<Button
			size="icon"
			variant="outline"
			className={cn(
				quantity_in_cart > 0 && "h-5 w-5 p-2 md:h-8 md:w-8 md:p-1",
			)}
			onClick={toggle_wishlist}
		>
			<Heart
				className={cn(
					wishlist.length > 0 && "fill-primary stroke-none",
				)}
			/>
		</Button>
	);
};

export default WishlistControl;
