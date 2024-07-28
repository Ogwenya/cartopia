import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import AddBrand from "./new-brand";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/brands`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["brands"] },
    }
  );

  const brands = await response.json();

  if (brands.error) {
    throw new Error(brands.message);
  }

  return { brands, access_token };
}

const BrandsPage = async () => {
  const { brands, access_token } = await getData();
  return (
    <div>
      <h1 className="text-2xl">Product Brands</h1>
      <div className="max-w-3xl mx-auto py-4">
        <DataTable
          columns={columns}
          data={brands}
          other_button={<AddBrand access_token={access_token} />}
        />
      </div>
    </div>
  );
};

export default BrandsPage;
