"use client";

import { useState } from "react";
import { AlertCircle, PenBox, PlusIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import SubmitButton from "@/components/ui/submit-button";
import revalidate_data from "@/app/actions";

const EditAddress = ({ shipment_counties, address, access_token }) => {
	const [name, set_name] = useState(address.name);
	const [phone_number, set_phone_number] = useState(address.phone_number);
	const [county, set_county] = useState(address.county.name);
	const [sub_county, set_sub_county] = useState(address.town.name);
	const [ward, set_ward] = useState(address.area.name);
	const [is_default, set_is_default] = useState(address.default_address);
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState(null);
	const [modal_open, set_modal_open] = useState(false);

	const submit_new_address = async () => {
		set_error(null);

		if (!name || !phone_number || !county || !sub_county || !ward) {
			set_error("Fill all the fields.");
			return;
		}

		try {
			set_loading(true);

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/v0/client/addresses/${address.id}`,
				{
					method: "PATCH",
					body: JSON.stringify({
						name,
						phone_number,
						county,
						town: sub_county,
						area: ward,
						is_default,
					}),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${access_token}`,
					},
				},
			);

			const result = await res.json();

			set_loading(false);

			if (result.error) {
				set_error(
					Array.isArray(result.message)
						? result.message[0]
						: result.message,
				);
			} else {
				set_error(null);
				set_modal_open(false);
				revalidate_data("addresses");
			}
		} catch (error) {
			set_loading(false);
			set_error(error.message);
		}
	};

	return (
		<Dialog open={modal_open} onOpenChange={set_modal_open}>
			<DialogTrigger asChild>
				<Button size="icon" variant="ghost">
					<PenBox className="stroke-blue-600" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Address</DialogTitle>
					<DialogDescription>Edit Shipping Address</DialogDescription>
				</DialogHeader>
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<div className="grid gap-4 py-3">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="John Doe"
							value={name}
							onChange={(e) => set_name(e.target.value)}
							disabled={loading}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="phone_number">phone_number</Label>
						<Input
							id="phone_number"
							placeholder="0712345678"
							value={phone_number}
							onChange={(e) => set_phone_number(e.target.value)}
							disabled={loading}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="sub_county">County</Label>
						<Select
							id="county"
							value={county}
							onValueChange={set_county}
							disabled={loading}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select county" />
							</SelectTrigger>
							<SelectContent>
								{shipment_counties.map((county) => (
									<SelectItem
										value={county.name}
										key={county.name}
									>
										{county.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="county">Sub-County</Label>
						<Select
							id="sub_county"
							value={sub_county}
							onValueChange={set_sub_county}
							disabled={!county || loading}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select sub-county" />
							</SelectTrigger>
							<SelectContent>
								{shipment_counties
									.filter((entry) => entry.name === county)[0]
									?.shipmentTowns.map((sub_county) => (
										<SelectItem
											value={sub_county.name}
											key={sub_county.name}
										>
											{sub_county.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="ward">Ward</Label>
						<Select
							id="ward"
							value={ward}
							onValueChange={set_ward}
							disabled={!county || !sub_county || loading}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select ward" />
							</SelectTrigger>
							<SelectContent>
								{shipment_counties
									.filter((entry) => entry.name === county)[0]
									?.shipmentTowns.filter(
										(val) => val.name === sub_county,
									)[0]
									?.shipment_areas.map((area) => (
										<SelectItem
											value={area.name}
											key={area.name}
										>
											{area.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							checked={is_default}
							onCheckedChange={set_is_default}
							id="is_default"
							disabled={loading}
						/>
						<label
							htmlFor="is_default"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Set as default Address
						</label>
					</div>
				</div>
				<DialogFooter>
					<SubmitButton
						type="submit"
						loading={loading}
						onClick={submit_new_address}
					>
						Save Changes
					</SubmitButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditAddress;
