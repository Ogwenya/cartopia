import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { Plus } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/products`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["products"] },
    }
  );

  const products = await response.json();

  if (products.error) {
    throw new Error(products.message);
  }

  return { products, access_token };
}

const AddProductButton = () => {
  return (
    <Button variant="outline" size="sm" className="h-8" asChild>
      <Link href="/products/new">
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Link>
    </Button>
  );
};

const ProductsPage = async () => {
  const { products, access_token } = await getData();

  return (
    <div>
      <h1 className="text-2xl">Products</h1>
      <div className="mx-auto py-4">
        <DataTable
          columns={columns}
          data={products}
          other_button={<AddProductButton />}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
