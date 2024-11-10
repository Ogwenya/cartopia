import { getServerSession } from "next-auth";
import CampaignImages from "@/components/homepage/campaign-images";
import CategoriesSidebar from "@/components/homepage/categories-sidebar";
import FeatureBrands from "@/components/homepage/feature-brands";
import FeatureCategories from "@/components/homepage/feature-categories";
import FeatureProductsCarousel from "@/components/homepage/feature-products-carousel";
import ProductCard from "@/components/product-card";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const revalidate = 600;

async function getData() {
  try {
    const session = await getServerSession(authOptions);

    const headers = session
      ? { Authorization: `Bearer ${session.access_token}` }
      : { "X-API-KEY": process.env.API_KEY };

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${API_URL}/v0/client/products/feature-products`,
      {
        headers,
        next: { tags: ["feature-products"] },
      },
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw new Error(
      "Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.",
    );
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
    <section className="bg-secondary">
      <div className="flex flex-1">
        <div className="hidden lg:block lg:w-[500px]">
          <CategoriesSidebar categories={categories} />
        </div>

        <div className="block w-full lg:overflow-hidden">
          <div className="px-1 xl:px-0">
            <div class="w-full pt-4 pb-20 lg:py-7 space-y-6">
              {campaign_images.length > 0 && (
                <CampaignImages campaign_images={campaign_images} />
              )}

              <div className="lg:hidden lg:my-0">
                <FeatureCategories categories={categories} />
              </div>

              <div class="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-1 md:gap-3">
                {latest_products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>

              <FeatureBrands brands={brands} />

              {feature_products_per_brand &&
                feature_products_per_brand.map((brand, index) => (
                  <FeatureProductsCarousel
                    title={brand.name}
                    slug={`/brands/${brand.slug}`}
                    products={brand.products}
                    show_cart_buttons={false}
                    key={index}
                  />
                ))}

              {feature_products_per_category &&
                feature_products_per_category.map((category, index) => (
                  <FeatureProductsCarousel
                    title={category.name}
                    slug={`/categories/${category.slug}`}
                    products={category.products}
                    show_cart_buttons={false}
                    key={index}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
