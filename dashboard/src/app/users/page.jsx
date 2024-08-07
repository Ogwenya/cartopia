import { getServerSession } from "next-auth/next";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { CreateUser } from "./create-user";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/users`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["users"] },
    }
  );

  const result = await response.json();

  if (result.error) {
    throw new Error(result.message);
  }

  return { result, access_token };
}

const UsersPage = async () => {
  const { result, access_token } = await getData();
  return (
    <section>
      <div className="flex justify-between items-center px-6 py-4 rounded">
        <h2 className="text-2xl">User Management</h2>
      </div>

      <div className="container mx-auto py-4">
        <DataTable
          columns={columns}
          data={result}
          other_button={<CreateUser access_token={access_token} />}
        />
      </div>
    </section>
  );
};

export default UsersPage;
