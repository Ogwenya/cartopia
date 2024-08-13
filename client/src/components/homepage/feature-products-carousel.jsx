"use client";

import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "../product-card";

const FeatureProductsCarousel = ({ title, slug, products }) => {
  return (
    <Card className="my-10 shadow-none bg-muted/50">
      <CardTitle className="text-xl font-bold py-2 px-4 sm:px-6 lg:px-8 mb-6 text-muted-foreground">
        <Link href={`/shop/${slug}`}>{title}</Link>
      </CardTitle>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          scrollPrev: false,
        }}
        className="w-full mb-8"
      >
        <CarouselPrevious className="-top-10 float-right right-8 relative" />
        <CarouselNext className="-top-10 float-right -right-5 relative" />

        <CarouselContent className="ml-3 gap-2">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-full md:basis-[250px] p-0"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Card>
  );
};

export default FeatureProductsCarousel;
