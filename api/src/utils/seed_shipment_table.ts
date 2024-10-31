import * as fs from 'fs';
import * as path from 'path';

export default async function seed_shipment_table({
	countyRepository,
	townRepository,
	shipmentArea,
}) {
	const filePath = path.join(__dirname, 'county-data.json');
	const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

	for (const { county: countyName, sub_counties } of data) {
		const county = countyRepository.create({ name: countyName });

		const shipment_towns = sub_counties.map(
			({ name: subCountyName, wards }) => {
				const sub_county = townRepository.create({ name: subCountyName });

				const shipment_areas = wards.map((ward_name) => {
					const area = new shipmentArea();
					area.name = ward_name;
					return area;
				});

				sub_county.shipment_areas = shipment_areas;

				return sub_county;
			},
		);

		county.shipmentTowns = shipment_towns;

		await countyRepository.save(county);

		console.log(`Inserted county: ${county.name}`);
	}
}
