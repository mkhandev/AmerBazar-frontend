import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const slides = [
  "/images/slider/slider1.jpg",
  "/images/slider/slider2.jpg",
  "/images/slider/slider3.jpg",
];

const ProductsCarousel = () => {
  return (
    <>
      <Carousel
        className="w-full my-5"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index}>
              <Link href="/">
                <img
                  src={slides[index]}
                  alt=""
                  height="0"
                  width="0"
                  sizes="100vw"
                  className="w-full h-auto max-h-[450px]"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default ProductsCarousel;
