"use client";

import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const LargeScreenLayout = async ({ brands }) => {
  return (
    <div className="grid grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
      {brands.map((brand) => (
        <Link href={`/brands/${brand.slug}`} key={brand.id}>
          <Card>
            <CardContent className="flex items-center justify-center p-0 py-3">
              <span className="text-xs sm:text-base">{brand.name}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

const SmallScreenLayout = async ({ brands }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        scrollPrev: false,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-1">
        {brands.map((brand) => (
          <CarouselItem key={brand.id} className="pl-1 basis-1/4">
            <Link href={`/brands/${brand.slug}`}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-3">
                    <span className="text-xs sm:text-base">{brand.name}</span>
                  </CardContent>
                </Card>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const FeatureBrands = ({ brands }) => {
  return (
    <section>
      <div className="mx-auto my-5 py-5 px-4 w-full">
        <h2 className="text-xl md:text-2xl text-primary font-bold">
          Top Brands
        </h2>

        <div className="mt-6">
          <div className="hidden md:block">
            <LargeScreenLayout brands={brands.slice(0, 12)} />
          </div>

          <div className="md:hidden">
            <SmallScreenLayout brands={brands.slice(0, 12)} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBrands;
