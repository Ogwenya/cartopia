"use client";

import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const FeatureCategories = ({ categories }) => {
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
      <CarouselContent>
        {categories.map((category) => (
          <CarouselItem key={category.id} className="basis-1/3 md:basis-1/4">
            <Link href={`/categories/${category.slug}`} legacyBehavior>
              <Card className="py-1 h-full rounded-none border-none shadow-none">
                <CardContent className="py-3">
                  <AspectRatio ratio={11 / 7} className="">
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full"
                    />
                  </AspectRatio>
                  <CardTitle className="mt-2 text-center text-xs">
                    {category.name}
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeatureCategories;
