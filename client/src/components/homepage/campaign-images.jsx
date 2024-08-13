"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const CampaignImages = ({ campaign_images }) => {
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
        {campaign_images.map((image) => (
          <CarouselItem key={image.id}>
            <img
              src={image.image_url}
              alt={image.id}
              className="w-full h-full max-h-96 aspect-video"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CampaignImages;
