"use client";

import Categories from "@/components/Home/Categories";
import ProductsCarousel from "@/components/Home/HomeCarousel/ProductsCarousel";
import NewArrivalProduct from "@/components/Home/NewArrivalProduct";

export default function Home() {
  return (
    <>
      <ProductsCarousel />
      <Categories />
      <NewArrivalProduct />
    </>
  );
}
