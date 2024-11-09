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
import { ChevronRightIcon } from "@radix-ui/react-icons";

const FeatureProductsCarousel = ({
  title,
  slug,
  products,
  show_cart_buttons,
}) => {
  return (
    <Card className="my-10 shadow-none border-none rounded-none">
      <div className="flex justify-between py-3 px-2 mb-2 bg-primary text-primary-foreground">
        <CardTitle className="text-sm md:text-xl font-bold">
          <Link href={slug}>{title}</Link>
        </CardTitle>

        <Link href={slug} className="flex items-center gap-2 hover:underline">
          <span className="text-xs md:text-sm">View All</span>
          <ChevronRightIcon className="h-4" />
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          scrollPrev: false,
        }}
        className="w-full mb-2 group"
      >
        <CarouselPrevious className="left-3 z-50 disabled:cursor-not-allowed disabled:pointer-events-auto hidden group-hover:flex" />
        <CarouselNext className="right-3 z-50 disabled:cursor-not-allowed disabled:pointer-events-auto hidden group-hover:flex" />
        <CarouselContent className="ml-1 clear-both">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-[220px] px-1"
            >
              <ProductCard
                product={product}
                show_cart_buttons={show_cart_buttons}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Card>
  );
};

export default FeatureProductsCarousel;
