import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import calculate_discount from "@/lib/calculate-discounts";
import AddToCartButton from "./add-to-cart-button";

const ProductCard = ({ product }) => {
  const { after_discount_price } = calculate_discount(product);

  return (
    <Card className="h-full transform overflow-hidden rounded shadow-none border-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
      <CardHeader className="p-2">
        <Link href={`/${product.slug}`} className="w-full">
          <AspectRatio
            ratio={10 / 9}
            className="w-full flex items-center justify-center px-2"
          >
            <img
              src={product.images[0].image_url}
              className="max-h-full max-w-full p-2"
              alt={product.name}
              loading="lazy"
              decoding="async"
            />
          </AspectRatio>
        </Link>
        {/* discount */}
        {product.discount_value > 0 && (
          <div className="absolute top-3 rounded bg-primary text-primary-foreground px-1.5 text-xs font-semibold leading-6 text-light right-3 sm:px-2 md:top-4 md:px-2.5 md:right-4 rtl:md:left-4">
            {product.discount_type === "Amount"
              ? `KES ${product.discount_value}`
              : `${product.discount_value}%`}
          </div>
        )}
      </CardHeader>

      <CardContent className="px-1.5">
        <CardTitle className="max-md:text-sm">
          <Link href={`/${product.slug}`}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "KES",
            }).format(after_discount_price)}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-ellipsis mt-3 max-md:text-xs">
          <Link href={`/${product.slug}`}>{product.name}</Link>
        </CardDescription>
      </CardContent>

      <CardFooter>
        <AddToCartButton product={product} className="w-full" />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
