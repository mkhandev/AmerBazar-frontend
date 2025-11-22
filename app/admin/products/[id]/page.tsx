"use client";

import ProductForm from "@/app/admin/products/ProductForm";
import FullPageLoader from "@/components/FullPageLoader";
import { useProduct } from "@/hooks/useProduct";
import React, { use } from "react";

function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { productDetails, isProductDetailsLoading } = useProduct(Number(id));

  const productData = productDetails?.data;
  console.log(productData);
  // console.log(id);

  if (isProductDetailsLoading) return <FullPageLoader />;

  return (
    <div className="w-full p-6 bg-[var(--bg-inner)]">
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm
          type="Update"
          product={{
            ...productData,
          }}
          productId={productData.id}
        />
      </div>
    </div>
  );
}

export default ProductEditPage;
