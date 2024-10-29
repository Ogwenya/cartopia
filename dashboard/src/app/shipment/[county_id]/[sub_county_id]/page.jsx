import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";

async function getData(params) {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/shipment/${params.county_id}/${params.sub_county_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const sub_county_data = await response.json();

  if (sub_county_data.error) {
    throw new Error(sub_county_data.message);
  }

  return sub_county_data;
}

const SubCountyPage = async ({ params }) => {
  const sub_county_data = await getData(params);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl">Shipment Wards for {sub_county_data.name}</h1>

      <div className="max-w-4xl mx-auto py-4">
        <DataTable columns={columns} data={sub_county_data.shipment_areas} />
      </div>
    </div>
  );
};

export default SubCountyPage;
