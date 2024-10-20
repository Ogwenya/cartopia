"use client";

import { useEffect, useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Card } from "@/components/ui/card";

const ProductImagesCarousel = ({ images }) => {
  const mainRef = useRef(null);
  const thumbsRef = useRef(null);

  const mainOptions = {
    type: "loop",
    perPage: 1,
    perMove: 1,
    gap: "1rem",
    pagination: false,
    arrows: false,
  };

  const thumbsOptions = {
    type: "slide",
    rewind: true,
    gap: 10,
    pagination: false,
    cover: true,
    isNavigation: true,
    arrows: false,
  };

  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  });

  return (
    <div className="grid grid-cols-1 space-y-3">
      <div>
        <Card className="border-0 rounded-none">
          <Splide
            options={mainOptions}
            ref={mainRef}
            className="p-0 mb-0 h-fit"
          >
            {images.map((image) => (
              <SplideSlide key={image.id}>
                <div className="h-36 sm:h-48 md:h-72 mx-auto flex items-center justify-center">
                  <img
                    src={image.image_url}
                    alt="product image"
                    className="max-h-full md:aspect-auto"
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </Card>
      </div>

      <Splide
        options={thumbsOptions}
        ref={thumbsRef}
        className="p-1 mb-0 w-full shadow"
      >
        {images.map((thumbnail, index) => (
          <SplideSlide key={thumbnail.id} className="thumbnail">
            <div className="h-8 w-12">
              <img
                src={thumbnail.image_url}
                alt={index}
                className="h-full w-full object-cover aspect-video"
              />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default ProductImagesCarousel;
