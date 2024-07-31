import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateProductForm from "./create-product-form";

async function getData() {
  const { access_token } = await getServerSession(authOptions);

  const categories_response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/categories`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["categories"] },
    }
  );
  const brands_response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/brands`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      next: { tags: ["brands"] },
    }
  );

  const categories = await categories_response.json();
  const brands = await brands_response.json();

  if (categories.error || brands.error) {
    throw new Error(categories.message || brands.message);
  }

  return { categories, brands, access_token };
}

const AddProductPage = async () => {
  const { categories, brands, access_token } = await getData();
  return (
    <div>
      <h1 className="text-2xl mb-4">Add new product</h1>
      <CreateProductForm
        categories={categories}
        brands={brands}
        access_token={access_token}
      />
    </div>
  );
};

export default AddProductPage;
