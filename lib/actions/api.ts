import { apiUrl } from "@/lib/constants";
import { ProductApiResponse } from "@/types/products";

export async function fetchCategories() {
  const res = await fetch(`${apiUrl}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
export async function fetchProductsOld(
  page: number = 1
): Promise<ProductApiResponse> {
  const res = await fetch(`${apiUrl}/products?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProducts(
  page: number = 1,
  category?: string,
  q?: string
): Promise<ProductApiResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const res = await fetch(`${apiUrl}/products?${params}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
