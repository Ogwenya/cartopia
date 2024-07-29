import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import AddCategory from "./add-category";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/categories`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["categories"] },
    }
  );

  const categories = await response.json();

  if (categories.error) {
    throw new Error(categories.message);
  }

  return { categories, access_token };
}

const CategoriesPage = async () => {
  const { categories, access_token } = await getData();

  return (
    <div>
      <h1 className="text-2xl">Product Categories</h1>
      <div className="max-w-3xl mx-auto py-4">
        <DataTable
          columns={columns}
          data={categories}
          other_button={<AddCategory access_token={access_token} />}
        />
      </div>
    </div>
  );
};

export default CategoriesPage;
