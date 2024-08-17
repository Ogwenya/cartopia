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

const FeatureProductsCarousel = ({ title, slug, products }) => {
  return (
    <Card className="my-10 md:shadow-none border-none md:rounded-none max-md:bg-secondary">
      <div className="flex justify-between py-3 max-md:px-2 lg:mx-8 mb-2 border-b max-md:bg-white">
        <CardTitle className="text-xl font-bold text-muted-foreground">
          <Link href={slug}>{title}</Link>
        </CardTitle>

        <Link
          href={slug}
          className="flex items-center gap-2 hover:underline hover:text-muted-foreground"
        >
          <span>View All</span>
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
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Card>
  );
};

export default FeatureProductsCarousel;
