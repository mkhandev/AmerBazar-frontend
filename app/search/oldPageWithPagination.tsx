"use client";

import { fetchCategories, fetchProducts } from "@/lib/actions/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

const SearchPage = () => {
  const {
    data: categories,
    isLoading: catLoading,
    error: catError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [page, setPage] = useState(1);

  // Fetch paginated products
  const {
    data: productsData,
    isLoading: prodLoading,
    error: prodError,
    isFetching,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    keepPreviousData: true,
  });

  const totalPages = productsData?.last_page ?? 1;
  const currentPage = productsData?.current_page ?? 1;

  // --- Pagination number generator ---
  const getPageNumbers = () => {
    const delta = 2; // how many pages to show around current
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i as number;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();
  console.log(pages);

  return (
    <div className="grid md:grid-cols-5 md:gap-5 bg-white">
      <div className="text-[#212121]">
        <h2 className="font-normal text-[14px] mt-5 mb-5">Category</h2>
        <div>
          <ul>
            {categories?.map((cat: any) => (
              <li key={cat.id} className="mb-[3px]">
                <Link href="/"> {cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {productsData?.data?.map((product: any) => (
            <div key={product.id} className="border p-2">
              <img src={product.images[0]?.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>BDT {product.price}</p>
              <p>BDT {product.id}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {/* Previous */}
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &lt;
          </button>

          {/* Page numbers */}
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setPage(p as number)}
                className={`px-3 py-1 border rounded ${
                  p === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>

        {isFetching && (
          <p className="text-sm text-gray-500 mt-2 text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
