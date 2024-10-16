import MainProductsLayout from "@/components/main-products-layout";

export const metadata = {
  title: "Shop",
};

export const revalidate = 600;

async function getData(searchParams) {
  const page = searchParams.page || 1;
  const search = searchParams.search;
  try {
    const url = search
      ? `products?search=${search}&page=${page}`
      : `products?page=${page}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v0/client/${url}`,
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

const CatalogPage = async ({ searchParams }) => {
  const { products, total_pages, categories, brands } = await getData(
    searchParams
  );

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

export default CatalogPage;