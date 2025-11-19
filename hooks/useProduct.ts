import { useQuery } from "@tanstack/react-query";

export function useProduct(id?: number, page = 1, filters: any = {}) {
  const {
    data: productList,
    isLoading: isLoadingProductList,
    isFetching: isProductListFetching,
  } = useQuery({
    queryKey: ["product_list", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        ...(filters.status !== undefined ? { status: filters.status } : {}),
        ...(filters.q ? { q: filters.q } : {}),
      }).toString();

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      return data;
    },
    placeholderData: (prevData) => prevData,
  });

  return {
    productList,
    isLoadingProductList,
    isProductListFetching,
  };
}
