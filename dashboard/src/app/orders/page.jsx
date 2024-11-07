import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/orders`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["orders"] },
    },
  );

  const orders = await response.json();

  if (orders.error) {
    throw new Error(orders.message);
  }

  return orders;
}

const OrdersPage = async () => {
  const orders = await getData();

  return (
    <section>
      <h1 className="text-2xl">Orders</h1>
      <div className="mx-auto py-4">
        <DataTable columns={columns} data={orders} />
      </div>
    </section>
  );
};

export default OrdersPage;
