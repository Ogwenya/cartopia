import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import format_date from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { CardDescription } from "../ui/card";
import { badge_color, button_color } from "./order-status-colors";

const OrdersCards = ({ orders }) => {
	return (
		<>
			{orders.length > 0 ? (
				<ul
					role="list"
					className="border-b border-t border-muted list-none divide-y"
				>
					{orders.map(async (order) => {
						return (
							<li className="py-6 space-y-3" key={order.id}>
								<div className="flex justify-between items-center">
									<h4 className="text-sm max-md:truncate">
										<Link
											href={`/account/orders/${order.order_number}`}
											className="text-primary/80"
										>
											<span className="font-semibold">
												Order No:
											</span>{" "}
											{order.order_number}
										</Link>
									</h4>

									<Button
										variant="outline"
										className={button_color(order.status)}
										asChild
									>
										<Link
											href={`/account/orders/${order.order_number}`}
										>
											View
										</Link>
									</Button>
								</div>

								<Badge
									className={cn(
										"w-fit",
										badge_color(order.status),
									)}
								>
									{order.status}
								</Badge>

								<div className="flex flex-col gap-1 text-sm">
									<span className="font-semibold">
										Order Date
									</span>

									<span>{format_date(order.created_at)}</span>
								</div>
							</li>
						);
					})}
				</ul>
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<CardDescription>
						<ShoppingBag className="size-20 opacity-25" />
					</CardDescription>

					<CardDescription className="mt-4 opacity-50">
						No Orders
					</CardDescription>
				</div>
			)}
		</>
	);
};

export default OrdersCards;
