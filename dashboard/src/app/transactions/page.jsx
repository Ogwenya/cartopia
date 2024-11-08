import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/transactions`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["transactions"] },
    },
  );

  const transactions = await response.json();

  if (transactions.error) {
    throw new Error(transactions.message);
  }

  return transactions;
}

const TransactionsPage = async () => {
  const transactions = await getData();

  return (
    <section>
      <h1 className="text-2xl">Transactions</h1>
      <div className="mx-auto py-4">
        <DataTable columns={columns} data={transactions} />
      </div>
    </section>
  );
};

export default TransactionsPage;
