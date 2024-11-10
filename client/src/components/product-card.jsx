import Link from "next/link";
import calculate_discount from "@/lib/calculate-discounts";
import AddToCartButton from "./add-to-cart-button";
import format_currency from "@/lib/format-currency";

const ProductCard = ({ product, show_cart_buttons = true }) => {
  const { after_discount_price } = calculate_discount(product);

  return (
    <article class="h-full transform overflow-hidden rounded border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
      <div class="relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64">
        <span class="sr-only">Product Image</span>
        <img
          alt={product.name}
          loading="lazy"
          decoding="async"
          data-nimg="fill"
          className="absolute h-full w-full p-3 inset-0 text-transparent object-contain"
          src={product.images[0].image_url}
        />

        {product.discount_value > 0 && (
          <div className="absolute top-3 rounded bg-primary text-primary-foreground px-1.5 text-xs font-semibold leading-6 right-3 sm:px-2 md:top-4 md:px-2.5 md:right-4 rtl:md:left-4">
            -{" "}
            {product.discount_type === "Amount"
              ? `KES ${product.discount_value}`
              : `${product.discount_value}%`}
          </div>
        )}
      </div>
      <header class="p-3 md:p-6">
        <Link href={`/${product.slug}`}>
          <h3 class="mb-2 cursor-pointer line-clamp-2 text-ellipsis text-xs text-body md:text-sm">
            {product.name}
          </h3>
          <div class="mb-4 flex items-center">
            <span class="text-sm font-semibold text-heading md:text-base">
              {format_currency(after_discount_price)}
            </span>
          </div>
        </Link>

        {show_cart_buttons && (
          <div>
            <AddToCartButton product={product} className="w-full" />
          </div>
        )}
      </header>
    </article>
  );
};

export default ProductCard;
