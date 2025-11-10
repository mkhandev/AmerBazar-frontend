import ProductPrice from "@/components/Product/ProductPrice";
import Rating from "@/components/Product/Rating";
import { Product } from "@/types/products";
import Image from "next/image";
import React, { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const ProductCard = ({ product }: { product: Product }) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = product.images?.[0]?.image || "/images/placeholder2.jpg";

  return (
    <div className="bg-white hover:shadow-lg border">
      <div className="relative w-full">
        {isLoading && <Skeleton className="inset-0 w-full h-20 rounded-lg" />}
        <Link href={`/product/${product.slug}`}>
          <Image
            src={imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className={`object-contain transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="max-h-[45px] text-[14px] line-clamp-2 overflow-hidden p-2">
        <Link href={`/product/${product.slug}`}>{product.name}</Link>
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
