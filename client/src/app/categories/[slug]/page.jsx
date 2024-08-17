import { notFound } from "next/navigation";
import MainProductsLayout from "@/components/main-products-layout";

export const revalidate = 600;

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: params.slug,
    openGraph: {
      title: `Shop | ${params.slug}`,
    },
  };
}

async function getData(slug, searchParams) {
  const page = searchParams.page || 1;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v0/client/categories/${slug}?page=${page}`,
      {
        cache: "no-store",
        headers: { Authorization: `Bearer ${process.env.API_KEY}` },
      }
    );

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error || result.message);
    }

    return result;
  } catch (error) {
    throw new Error(
      "Something went wrong, try refreshing the page or try again later.If this problem persist, let us know."
    );
  }
}

const CategoriesPage = async ({ params, searchParams }) => {
  const { products, total_pages, categories, brands } = await getData(
    params.slug,
    searchParams
  );

  if (!products) {
    notFound();
  }

  return (
    <section className="py-10 min-h-screen">
      <MainProductsLayout
        products={products}
        total_pages={total_pages}
        categories={categories}
        brands={brands}
      />
    </section>
  );
};

export default CategoriesPage;
