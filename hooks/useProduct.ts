import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProduct(id?: number, page = 1, filters: any = {}) {
  const queryClient = useQueryClient();

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
        ...(filters.category !== undefined
          ? { category: filters.category }
          : {}),
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

  const { data: productDetails, isLoading: isProductDetailsLoading } = useQuery(
    {
      queryKey: ["admin_product_details", id],
      queryFn: async () => {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          if (!res.ok)
            throw new Error(data.message || "Failed to fetch product");
        }
        return data;
      },
      enabled: !!id,
    }
  );

  const productAddMutationOld = useMutation({
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

  const productUpdateMutationOld = useMutation({
    mutationFn: async ({ id, productData }: any) => {
      const formData = new FormData();

      // console.log(id);

      formData.append("name", productData.name);
      formData.append("category_id", productData.category_id);
      formData.append("brand", productData.brand);
      formData.append("price", productData.price.toString());
      formData.append("stock", productData.stock.toString());
      formData.append("description", productData.description);

      // MAIN IMAGE
      if (productData.main_image_index !== null) {
        formData.append(
          "main_image_index",
          productData.main_image_index.toString()
        );
      }

      // EXISTING IMAGES TO KEEP
      if (productData.existing_images?.length) {
        productData.existing_images.forEach((img: any) => {
          formData.append(
            "existing_images[]",
            typeof img === "string" ? img : img.image
          );
        });
      }

      // IMAGES TO DELETE
      if (productData.deleted_images?.length) {
        productData.deleted_images.forEach((id: number) => {
          formData.append("deleted_images[]", id.toString());
        });
      }

      // NEW IMAGES
      if (productData.new_images?.length) {
        productData.new_images.forEach((file: File) => {
          formData.append("new_images[]", file);
        });
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) throw new Error(data.message || "Failed to update product");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_list"] });
      queryClient.invalidateQueries({ queryKey: ["admin_product_details"] });
    },
  });

  const productAddMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_list"] });
      //queryClient.invalidateQueries({ queryKey: ["product_list"] });
      //toast.success("Product added successfully");
    },
    onError: (error: any) => {
      //toast.error(error?.message || "Failed to add product");
    },
  });

  const productUpdateMutation = useMutation({
    mutationFn: async ({
      id,
      productData,
    }: {
      id: number;
      productData: FormData;
    }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        body: productData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["product_list"] });
      queryClient.invalidateQueries({ queryKey: ["admin_product_details"] });
    },
  });

  const productDeleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");
      return data;
    },
  });

  return {
    productList,
    isLoadingProductList,
    isProductListFetching,
    productDetails,
    isProductDetailsLoading,
    productAddMutation,
    productUpdateMutation,
    productDeleteMutation,
  };
}
