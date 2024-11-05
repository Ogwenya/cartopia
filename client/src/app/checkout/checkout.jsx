"use client";

import { useState } from "react";
import ShippinInformation from "./shipping-info";
import MakePayment from "./payment";

const Checkout = ({
	shipping_addresses,
	access_token,
	shipment_counties,
	sub_total,
}) => {
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

	const shipment_fees = shipment_counties
		.filter((county) => county.name === selected_address.county.name)[0]
		.shipmentTowns.filter(
			(town) => town.name === selected_address.town.name,
		)[0]
		.shipment_areas.filter(
			(area) => area.name === selected_address.area.name,
		)[0].fees;

	return (
		<div className="space-y-5">
			<ShippinInformation
				shipping_addresses={shipping_addresses}
				selected_address={selected_address}
				set_selected_address={set_selected_address}
			/>

			<MakePayment
				sub_total={sub_total}
				access_token={access_token}
				shipment_fees={shipment_fees}
				address_id={selected_address.id}
			/>
		</div>
	);
};

export default Checkout;
