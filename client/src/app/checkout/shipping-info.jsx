"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, User } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SelectAddress from "./select-address";

const ShippinInformation = ({ shipping_addresses }) => {
	const [selected_address, set_selected_address] = useState(
		shipping_addresses.length === 1
			? shipping_addresses[0]
			: shipping_addresses.filter(
					(address) => address.default_address === true,
			  ).length > 0
			? shipping_addresses.filter(
					(address) => address.default_address === true,
			  )[0]
			: shipping_addresses[0],
	);

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>Shipping Information</CardTitle>

					{shipping_addresses.length == 0 ? (
						<Link href="/account/addresses">
							<Button>Add</Button>
						</Link>
					) : (
						<SelectAddress
							shipping_addresses={shipping_addresses}
							set_selected_address={set_selected_address}
						/>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-2">
				{shipping_addresses.length > 0 ? (
					<>
						<div className="rounded-md border p-4 flex flex-col justify-between">
							<div className="space-y-3 text-sm text-muted-foreground">
								<p className="flex items-center gap-x-2">
									<span>
										<User className="h-5" />
									</span>
									<span>{selected_address.name}</span>
								</p>

								<p className="flex items-center gap-x-2">
									<span>
										<Phone className="h-5" />
									</span>
									<span>{selected_address.phone_number}</span>
								</p>
								<p className="flex items-start gap-x-2">
									<span>
										<MapPin />
									</span>
									<span>
										{selected_address.county.name} county,{" "}
										{selected_address.town.name} sub-county,{" "}
										{selected_address.area.name}
									</span>
								</p>
							</div>
						</div>
					</>
				) : (
					<>
						<CardDescription>No addresses saved</CardDescription>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default ShippinInformation;
