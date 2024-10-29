import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/shipment`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["shipment"] },
    },
  );

  const counties = await response.json();

  if (counties.error) {
    throw new Error(counties.message);
  }

  return counties;
}

const ShipmentPage = async () => {
  const counties = await getData();

  return (
    <div>
      <h1 className="text-2xl">Shipment locations</h1>
      <div className="max-w-3xl mx-auto py-4">
        <DataTable columns={columns} data={counties} />
      </div>
    </div>
  );
};

export default ShipmentPage;
