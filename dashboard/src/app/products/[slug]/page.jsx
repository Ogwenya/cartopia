import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditProductForm from "./edit-product-form";

async function getData(slug) {
  const { access_token } = await getServerSession(authOptions);

  const product_response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v0/admin/products/${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

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

  const product = await product_response.json();
  const categories = await categories_response.json();
  const brands = await brands_response.json();

  if (product.error || categories.error || brands.error) {
    throw new Error(product.message || categories.message || brands.message);
  }

  return { product, categories, brands, access_token };
}

const SingleProductPage = async ({ params }) => {
  const { product, categories, brands, access_token } = await getData(
    params.slug
  );
  return (
    <EditProductForm
      product={product}
      categories={categories}
      brands={brands}
      access_token={access_token}
    />
  );
};

export default SingleProductPage;
