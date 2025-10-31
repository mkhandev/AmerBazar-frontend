"use client";

import ProductCard from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategories, fetchProducts } from "@/lib/actions/api";
import { PRICES, RATINGS } from "@/lib/constants";
import { PARAMS, Product, ProductApiResponse } from "@/types/products";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const ProductSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-48 w-full rounded-md"></div>
);

const SearchPageClient = ({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sortby?: string;
  };
}) => {
  const { q, category, price, rating, sortby } = searchParams;

  const router = useRouter();
  const queryParams = useSearchParams();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const selectedCategory = categories?.find(
    (cat: any) => String(cat.id) === category
  );

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<ProductApiResponse, Error>({
      queryKey: ["products", q, category, price, rating, sortby],
      queryFn: ({ pageParam }) => {
        const page = (pageParam as number) || 1;
        return fetchProducts(page, q, category, price, rating, sortby);
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.next_page_url) {
          const url = new URL(lastPage.next_page_url);
          return Number(url.searchParams.get("page"));
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

  const params: Record<string, string> = {};

  const getFilterUrl = ({
    c,
    p,
    s,
    r,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
  }) => {
    const query = new URLSearchParams(queryParams.toString());

    if (q) query.set("q", q);
    if (c) query.set("category", c);
    if (p) query.set("price", p);
    if (r) query.set("rating", r);
    if (s) query.set("sortby", s);

    router.push(`/search?${query.toString()}`);
  };

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div className="grid md:grid-cols-5 md:gap-5 bg-white mt-7">
      <div className="text-[#212121] ">
        <div className="p-5">
          <h2 className="font-normal text-[20px] mb-5">Category</h2>
          <ul>
            <Link
              className={`${
                (category === "all" || category === "") &&
                "font-[500] text-[#37a001]"
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                getFilterUrl({ c: "all" });
              }}
            >
              Any
            </Link>
            {categories?.map((cat: any) => (
              <li key={cat.id}>
                <Link
                  className={`${
                    category == cat.id && "font-[500] text-[#37a001]"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    getFilterUrl({ c: cat.id });
                  }}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 pt-0">
          <h2 className="font-normal text-[20px] mb-5">Price</h2>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${
                    price === "all" && "font-[500] text-[#37a001]"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    getFilterUrl({ p: "all" });
                  }}
                >
                  Any
                </Link>
              </li>
              {PRICES.map((p) => (
                <li key={p.value}>
                  <Link
                    className={`${
                      price === p.value && "font-[500] text-[#37a001]"
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      getFilterUrl({ p: p.value });
                    }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-5 pt-0">
          <h2 className="font-normal text-[20px] mb-5">Ratings</h2>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${
                    rating === "all" && "font-[500] text-[#37a001]"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    getFilterUrl({ r: "all" });
                  }}
                >
                  Any
                </Link>
              </li>
              {RATINGS.map((r) => (
                <li key={r}>
                  <Link
                    className={`${
                      rating === r.toString() && "font-[500] text-[#37a001]"
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      getFilterUrl({ r: r.toString() });
                    }}
                  >
                    {`${r} stars & up`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 mt-5">
        <div className="flex flex-row justify-between pr-5 items-center mb-5">
          <div className="px-5 pl-0 mb-0 text-sm text-gray-700">
            {q && q !== "all" && (
              <span className="mr-2">
                <em className="font-[600] not-italic">Query: </em> {q}
              </span>
            )}

            {selectedCategory && category !== "all" && (
              <span className="mr-2">
                <em className="font-[600] not-italic">Category: </em>
                {selectedCategory.name}
              </span>
            )}

            {price && price !== "all" && (
              <span className="mr-2">
                <em className="font-[600] not-italic">Price: </em> {price}
              </span>
            )}

            {rating && rating !== "all" && (
              <span className="mr-2">
                <em className="font-[600] not-italic">Rating: </em>
                {rating} stars & up
              </span>
            )}

            {(!!(q && q !== "all") ||
              !!(category && category !== "all") ||
              !!(price && price !== "all") ||
              !!(rating && rating !== "all")) && (
              <Button variant="link" asChild className="p-0">
                <Link href="/search">Clear</Link>
              </Button>
            )}
          </div>

          <div className="flex flex-row items-center space-x-2">
            <div>Sort by:</div>
            <Select
              name="sortby"
              value={sortby || "latest"}
              onValueChange={(value) => {
                getFilterUrl({ s: value });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Product Latest</SelectItem>
                <SelectItem value="price-high">Price High</SelectItem>
                <SelectItem value="price-low">Price Low</SelectItem>
                <SelectItem value="rating-high">Rating High</SelectItem>
                <SelectItem value="rating-low">Rating Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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

export default SearchPageClient;
