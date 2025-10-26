"use client";

import Categories from "@/components/Home/Categories";
import ProductsCarousel from "@/components/Home/HomeCarousel/ProductsCarousel";

export default function Home() {
  return (
    <>
      <ProductsCarousel />
      <Categories />
    </>
  );
}
