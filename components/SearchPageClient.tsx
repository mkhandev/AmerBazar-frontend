"use client";

import ProductCard from "@/components/Product/ProductCard";
import { fetchCategories, fetchProducts } from "@/lib/actions/api";
import { Product, ProductApiResponse } from "@/types/products";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const ProductSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-48 w-full rounded-md"></div>
);

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<ProductApiResponse, Error>({
      queryKey: ["products", category, q],
      queryFn: ({ pageParam }) => {
        const page = (pageParam as number) || 1;
        return fetchProducts(page, category, q);
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.next_page_url) {
          const url = new URL(lastPage.next_page_url);
          return Number(url.searchParams.get("page") ?? 1);
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleCategoryClick = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", catId);
    router.push(`/search?${params.toString()}`);
  };

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div className="grid md:grid-cols-5 md:gap-5 bg-white">
      <div className="text-[#212121]">
        <h2 className="font-normal text-[14px] mt-5 mb-5">Category</h2>
        <ul>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`${
                category === String(cat.id) ? "font-semibold text-blue-600" : ""
              } mb-2 block text-left w-full cursor-pointer`}
            >
              {cat.name}
            </button>
          ))}
        </ul>
      </div>

      <div className="md:col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {data?.pages.map((page) =>
            page.data.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}

          {isFetchingNextPage &&
            Array.from({ length: 10 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
        </div>

        <div ref={ref} className="h-35 w-full"></div>
      </div>
    </div>
  );
};

export default SearchPage;
