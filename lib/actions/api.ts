import { apiUrl } from "@/lib/constants/common";
import { ProductApiResponse } from "@/types/products";

export async function fetchCategories() {
  const res = await fetch(`${apiUrl}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
export async function fetchProducts(
  page: number = 1
): Promise<ProductApiResponse> {
  const res = await fetch(`${apiUrl}/products?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
