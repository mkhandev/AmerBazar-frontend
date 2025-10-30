import React from "react";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import ProductList from "@/components/Product/ProductList";
import { fetchProducts } from "@/lib/actions/api";
import { ProductApiResponse } from "@/types/products";

const NewArrivalProduct = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductApiResponse, Error>({
    queryKey: ["newArrivalProducts"],
    queryFn: ({ pageParam }: QueryFunctionContext) =>
      fetchProducts(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.next_page_url) return lastPage.current_page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });

  if (isLoading)
    return <div className="mt-5 mb-5 text-[14px]">Loading products...</div>;
  if (isError)
    return <div className="mt-5 mb-5 text-[14px]">Error: {error.message}</div>;

  const products = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div>
      <ProductList products={products} />
      {hasNextPage && (
        <div className="mt-10">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-10 px-3 py-3 rounded border-2 border-[#37a001] block w-[250px] m-auto text-[20px] text-[#37a001] text-center"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewArrivalProduct;
