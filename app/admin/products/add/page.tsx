import ProductForm from "@/app/admin/products/add/ProductForm";
import React from "react";

const ProductPage = () => {
  return (
    <div className="w-full p-6 bg-[var(--bg-inner)]">
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </div>
  );
};

export default ProductPage;
