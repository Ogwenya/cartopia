import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export default async function seed_shipment_table() {
	const filePath = path.join(__dirname, 'county-data.json');
	const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

	for (const { county: countyName, sub_counties } of data) {
		const county = await prisma.shipmentCounty.create({
			data: {
				name: countyName,
				shipmentTowns: {
					create: sub_counties.map(({ name: subCountyName, wards }) => ({
						name: subCountyName,
						shipment_areas: {
							create: wards.map((wardName) => ({
								name: wardName,
								fees: 0,
							})),
						},
					})),
				},
			},
		});

		console.log(`Inserted county: ${county.name}`);
	}
}
