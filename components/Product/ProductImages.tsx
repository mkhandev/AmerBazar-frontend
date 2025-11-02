import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ProductImages = ({ images }: { images: ProductImage[] }) => {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    //const scrollAmount = 120;
    const scrollAmount = container.clientWidth;
    container.scrollTo({
      left:
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount,
      behavior: "smooth",
    });

    console.log(container.scrollWidth);
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // setCanScrollLeft(scrollLeft > 0);
    // setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    setCanScrollLeft(scrollWidth > clientWidth);
    setCanScrollRight(scrollWidth > clientWidth);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[400px] rounded-lg" />
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-[100px] h-[100px] rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const currentImage = images[current] || images[0];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <Image
        src={currentImage.image}
        alt="product-image"
        width={1000}
        height={1000}
        className="min-h-[300px] max-h-[450px] object-cover object-center"
      />

      {/* Thumbnails */}
      <div className="flex items-center">
        {canScrollLeft && (
          <button
            onClick={() => scrollThumbnails("left")}
            className="p-2 bg-transparent cursor-pointer"
          >
            {/* &#8592; */}
            <ChevronLeft />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-hidden space-x-2 px-2 py-1 scrollbar-none"
          style={{ scrollBehavior: "smooth" }}
        >
          {images.map((im, index) => (
            <div
              key={im.id}
              onClick={() => setCurrent(index)}
              className={cn(
                "flex-shrink-0 p-0.5 box-border border-2 cursor-pointer hover:border-[#37a001]",
                current === index && "border-[#37a001]"
              )}
            >
              <Image
                src={im.image}
                width={100}
                height={100}
                alt={`thumbnail-${index}`}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scrollThumbnails("right")}
            className="p-2 bg-transparent cursor-pointer"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductImages;
