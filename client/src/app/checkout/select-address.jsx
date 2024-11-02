"use client";

import { useState } from "react";
import { MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const SelectAddress = ({ shipping_addresses, set_selected_address }) => {
	const [modal_open, set_modal_open] = useState(false);

	const select_addess = async (address) => {
		await set_selected_address(address);
		set_modal_open(false);
	};

	return (
		<Dialog open={modal_open} onOpenChange={set_modal_open}>
			<DialogTrigger asChild>
				<Button>Change</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select Address</DialogTitle>
					<DialogDescription>
						Select address for your shipment
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 grid md:grid-cols-2 gap-3">
					{shipping_addresses.map((address) => (
						<div
							className="rounded-md border p-4 flex flex-col justify-between"
							key={address.id}
						>
							<div className="space-y-3 text-sm text-muted-foreground">
								<p className="flex items-center gap-x-2">
									<span>
										<User className="h-5" />
									</span>
									<span>{address.name}</span>
								</p>

								<p className="flex items-center gap-x-2">
									<span>
										<Phone className="h-5" />
									</span>
									<span>{address.phone_number}</span>
								</p>
								<p className="flex items-start gap-x-2">
									<span>
										<MapPin />
									</span>
									<span>
										{address.county.name} county,{" "}
										{address.town.name} sub-county,{" "}
										{address.area.name}
									</span>
								</p>
							</div>

							<Button
								className="mt-4"
								onClick={() => select_addess(address)}
							>
								Select
							</Button>
						</div>
					))}
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => set_modal_open(false)}
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default SelectAddress;
