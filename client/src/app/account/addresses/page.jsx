import { getServerSession } from "next-auth";
import { MapPin, Phone, User } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CardDescription, CardHeader } from "@/components/ui/card";
import AddAddress from "./add-address";
import EditAddress from "./edit-address";
import DeleteAddress from "./delete-address";

export const metadata = {
	title: "Address Book",
};

async function getData() {
	const { access_token } = await getServerSession(authOptions);

	try {
		const headers = {
			Authorization: `Bearer ${access_token}`,
		};
		const API_URL = process.env.NEXT_PUBLIC_API_URL;

		const response = await fetch(`${API_URL}/v0/client/addresses`, {
			headers: headers,
			next: { tags: ["addresses"] },
		});

		const data = await response.json();

		if (data.error) {
			throw new Error(data.message);
		}

		return { data, access_token };
	} catch (error) {
		throw new Error(
			"Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.",
		);
	}
}

const AddressesPage = async () => {
	const { data, access_token } = await getData();

	return (
		<section className="h-full">
			<CardHeader className="p-0">
				<div className="flex items-center justify-between">
					<span className="font-medium">Address Book</span>
					<AddAddress
						access_token={access_token}
						shipment_counties={data.shipment_counties}
					/>
				</div>
			</CardHeader>
			{data.addresses.length > 0 ? (
				<div className="mt-4 grid md:grid-cols-2 gap-3">
					{data.addresses.map((address) => (
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

								{address.default_address && (
									<p className="font-bold text-red-300">
										Default address
									</p>
								)}
							</div>
							<div className="flex items-center mt-5">
								<EditAddress
									access_token={access_token}
									shipment_counties={data.shipment_counties}
									address={address}
								/>

								<DeleteAddress
									access_token={access_token}
									address={address}
								/>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-full">
					<CardDescription>
						<MapPin className="size-20 opacity-25" />
					</CardDescription>

					<CardDescription className="mt-4 opacity-50">
						No Addresses
					</CardDescription>
				</div>
			)}
		</section>
	);
};

export default AddressesPage;
