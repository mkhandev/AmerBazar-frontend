import { useMutation, useQuery } from "@tanstack/react-query";

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

  const productAddMutation = useMutation({
    mutationFn: async (productData: any) => {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("category_id", productData.category_id);
      formData.append("brand", productData.brand);
      formData.append("price", productData.price.toString());
      formData.append("stock", productData.stock.toString());
      formData.append("description", productData.description);

      if (productData.main_image_index !== null) {
        formData.append(
          "main_image_index",
          productData.main_image_index.toString()
        );
      }

      if (productData.images && (productData.images as FileList).length > 0) {
        Array.from(productData.images as FileList).forEach((file) => {
          formData.append("images[]", file);
        });
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add product");

      return data;
    },
  });

  return {
    productList,
    isLoadingProductList,
    isProductListFetching,
    productAddMutation,
  };
}
