import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
	title: "Cancelled Checkout",
};

const CancelledCheckout = () => {
	return (
		<section>
			<Card className={`mx-auto max-w-xl my-10`}>
				<CardHeader>
					<CardTitle className="text-xl">Payment Cancelled</CardTitle>
				</CardHeader>

				<CardContent>
					<CardDescription>
						You have cancelled your payment process.
					</CardDescription>

					<Button className="mt-10 w-full" asChild>
						<Link href="/checkout">Back To Checkout</Link>
					</Button>
				</CardContent>
			</Card>
		</section>
	);
};

export default CancelledCheckout;
