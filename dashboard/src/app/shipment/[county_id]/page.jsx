import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import AddShipmentLocation from "./add-location";

async function getData(county_id) {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/shipment/${county_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const county_data = await response.json();

  if (county_data.error) {
    throw new Error(county_data.message);
  }

  return { county_data, access_token };
}

const CountyPage = async ({ params }) => {
  const { county_data, access_token } = await getData(params.county_id);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl">
        Shipment locations for {county_data.name} county
      </h1>

      <div className="max-w-4xl mx-auto py-4">
        <DataTable
          columns={columns}
          data={county_data.shipmentLocation}
          other_button={
            <AddShipmentLocation
              access_token={access_token}
              county_id={params.county_id}
              county_name={county_data.name}
            />
          }
        />
      </div>
    </div>
  );
};

export default CountyPage;
