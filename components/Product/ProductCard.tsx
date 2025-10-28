import ProductPrice from "@/components/Product/ProductPrice";
import Rating from "@/components/Product/Rating";
import { Product } from "@/types/products";
import React from "react";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white">
      <img
        src={product.images[0]["image"]}
        alt={product.name}
        className="mx-auto object-contain"
      />
      <div className="max-h-[45px] text-[14px] line-clamp-2 overflow-hidden p-2">
        {product.name}
      </div>

      <div className="flex gap-1 justify-between p-2 pt-0">
        <Rating value={Number(product.rating)} />
        {product.stock > 0 ? (
          <ProductPrice value={Number(product.id)} />
        ) : (
          <p className="text-destructive">Out Of Stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
