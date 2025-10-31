import ProductPrice from "@/components/Product/ProductPrice";
import Rating from "@/components/Product/Rating";
import { Product } from "@/types/products";
import Image from "next/image";
import React, { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

const ProductCard = ({ product }: { product: Product }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="bg-white">
      <div className="relative w-full">
        {isLoading && <Skeleton className="inset-0 w-full h-20 rounded-lg" />}

        <Image
          src={product.images[0]["image"]}
          alt={product.name}
          width={600}
          height={400}
          className={`object-contain transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
        />
      </div>
      <div className="max-h-[45px] text-[14px] line-clamp-2 overflow-hidden p-2">
        {product.name}
      </div>

      <div className="flex gap-1 justify-between p-2 pt-0">
        <Rating value={Number(product.rating)} />
        {product.stock > 0 ? (
          <ProductPrice value={Number(product.price)} />
        ) : (
          <p className="text-destructive">Out Of Stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
