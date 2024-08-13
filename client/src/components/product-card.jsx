import Link from "next/link";
import Image from "next/image";
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
    <Card className="h-full transform overflow-hidden rounded shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
      <CardHeader>
        <Link href={`/shop/products/${product.slug}`}>
          <AspectRatio className="max-w-[70%] mx-auto" ratio={10 / 5}>
            <Image
              fill
              alt={product.name}
              loading="lazy"
              decoding="async"
              src={product.images[0].image_url}
            />
          </AspectRatio>
        </Link>
        {/* discount */}
        {product.discount_value > 0 && (
          <div className="absolute top-3 rounded bg-primary text-primary-foreground px-1.5 text-xs font-semibold leading-6 text-light right-3  sm:px-2 md:top-4 md:px-2.5 md:right-4 rtl:md:left-4">
            {product.discount_type === "Amount"
              ? `KES ${product.discount_value}`
              : `${product.discount_value}%`}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle>
          <Link href={`/shop/products/${product.slug}`}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "KES",
            }).format(after_discount_price)}
          </Link>
        </CardTitle>
        <CardDescription className="truncate mt-3">
          <Link href={`/shop/products/${product.slug}`}>{product.name}</Link>
        </CardDescription>
      </CardContent>

      <CardFooter>
        <AddToCartButton product={product} className="w-full" />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
