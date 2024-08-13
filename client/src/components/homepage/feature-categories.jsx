"use client";

import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
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
          <CarouselItem
            key={category.id}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4"
          >
            <Card className="py-4 h-full">
              <Link href={`/shop/categories/${category.slug}`}>
                <CardContent>
                  <AspectRatio ratio={11 / 7}>
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full"
                    />
                  </AspectRatio>

                  <CardTitle className="mt-4 text-center">
                    {category.name}
                  </CardTitle>
                </CardContent>
              </Link>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeatureCategories;
