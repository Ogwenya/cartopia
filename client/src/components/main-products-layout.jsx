import ProductCard from "./product-card";
import ProductsPagination from "./products-pagination";
import ShopNavbar from "./shop-navbar";

const MainProductsLayout = ({ products, total_pages, categories, brands }) => {
  return (
    <>
      <div className="mx-auto mb-6">
        <ShopNavbar categories={categories} brands={brands} />

        {products?.length > 0 ? (
          <div className="max-md:my-5 max-md:p-1 mt-5 grid max-sm:grid-cols-2 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] max-md:gap-1 gap-2">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-red-500">No products available.</p>
        )}
      </div>

      <div className="flex items-center justify-end">
        <ProductsPagination total_pages={total_pages} />
      </div>
    </>
  );
};

export default MainProductsLayout;
