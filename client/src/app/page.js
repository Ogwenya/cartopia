import CampaignImages from "@/components/homepage/campaign-images";
import CategoriesSidebar from "@/components/homepage/categories-sidebar";
import FeatureBrands from "@/components/homepage/feature-brands";
import FeatureCategories from "@/components/homepage/feature-categories";
import FeatureProductsCarousel from "@/components/homepage/feature-products-carousel";
import ProductCard from "@/components/product-card";

export const revalidate = 600;

async function getData() {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.API_KEY}`,
    };
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${API_URL}/v0/client/products/feature-products`,
      {
        headers: headers,
        next: { tags: ["feature-products"] },
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default async function Home() {
  const data = await getData();

  const {
    campaign_images,
    brands,
    categories,
    latest_products,
    feature_products_per_brand,
    feature_products_per_category,
  } = data;

  return (
    <section className="flex gap-x-0 h-full min-h-[calc(100vh-6rem)] relative">
      <aside className="hidden lg:block lg:w-[500px] overflow-y-scroll ative bg-inherit">
        <CategoriesSidebar categories={categories} />
      </aside>

      <aside className="lg:pl-8 mt-4 w-full lg:h-screen lg:overflow-y-scroll">
        <CampaignImages campaign_images={campaign_images} />

        <div className="lg:hidden my-8 lg:my-0">
          <FeatureCategories categories={categories} />
        </div>

        <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {latest_products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>

        <FeatureBrands brands={brands} />

        {feature_products_per_brand &&
          feature_products_per_brand.map((brand, index) => (
            <FeatureProductsCarousel
              title={brand.name}
              slug={`brands/${brand.slug}`}
              products={brand.products}
              key={index}
            />
          ))}

        {feature_products_per_category &&
          feature_products_per_category.map((category, index) => (
            <FeatureProductsCarousel
              title={category.name}
              slug={`categories/${category.slug}`}
              products={category.products}
              key={index}
            />
          ))}
      </aside>
    </section>
  );
}
